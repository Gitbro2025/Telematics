"""
Integration tests for RatingEngine end-to-end premium calculation.
"""
import pytest
from rating_engine import RatingEngine
from rating_engine.rate_tables import BASE_RATE_GBP
from rating_engine.engine import MINIMUM_PREMIUM_GBP


@pytest.fixture
def engine():
    return RatingEngine()


class TestPremiumOrdering:
    """
    Lower-risk profiles must produce lower premiums than higher-risk profiles.
    These tests codify the business invariants the pricing team has agreed on.
    """

    def test_alice_cheaper_than_carol(self, engine, driver_alice, driver_carol):
        """Best risk profile < mid-risk profile."""
        alice = engine.calculate(driver_alice).final_premium
        carol = engine.calculate(driver_carol).final_premium
        assert alice < carol

    def test_carol_cheaper_than_dan(self, engine, driver_carol, driver_dan):
        """Mid-risk < high-risk with claims."""
        carol = engine.calculate(driver_carol).final_premium
        dan = engine.calculate(driver_dan).final_premium
        assert carol < dan

    def test_alice_cheapest_overall(self, engine, driver_alice, driver_ben, driver_carol, driver_dan, driver_eve):
        alice = engine.calculate(driver_alice).final_premium
        for other in [driver_ben, driver_carol, driver_dan, driver_eve]:
            assert alice <= engine.calculate(other).final_premium

    def test_eve_most_expensive(self, engine, driver_alice, driver_ben, driver_carol, driver_dan, driver_eve):
        """Eve: 19yo, BMW M3, 3 claims, no NCD, no data → highest premium."""
        eve = engine.calculate(driver_eve).final_premium
        for other in [driver_alice, driver_ben, driver_carol, driver_dan]:
            assert eve >= engine.calculate(other).final_premium


class TestPremiumReasonableness:
    """
    Sanity checks that premiums are within plausible UK market ranges.
    2024 UK average motor premium = ~£640 (ABI Q4 2023).
    """

    def test_alice_below_market_average(self, engine, driver_alice):
        """Excellent risk should be comfortably below market average."""
        p = engine.calculate(driver_alice).final_premium
        assert p < 500, f"Alice's premium £{p} seems too high for best risk"

    def test_dan_above_market_average(self, engine, driver_dan):
        """Young + claims + bad driving should be well above market average."""
        p = engine.calculate(driver_dan).final_premium
        assert p > 1000, f"Dan's premium £{p} seems too low for high risk"

    def test_eve_is_very_high(self, engine, driver_eve):
        """Worst-case profile should be significantly above average."""
        p = engine.calculate(driver_eve).final_premium
        assert p > 2000, f"Eve's premium £{p} seems too low for worst-case risk"

    def test_no_premium_below_minimum(self, engine, driver_alice, driver_ben,
                                      driver_carol, driver_dan, driver_eve):
        for ctx in [driver_alice, driver_ben, driver_carol, driver_dan, driver_eve]:
            p = engine.calculate(ctx).final_premium
            assert p >= MINIMUM_PREMIUM_GBP


class TestPremiumBreakdown:
    def test_breakdown_has_five_factors(self, engine, driver_carol):
        bd = engine.calculate(driver_carol)
        assert len(bd.factors) == 5

    def test_factor_names_present(self, engine, driver_carol):
        bd = engine.calculate(driver_carol)
        names = {f.name for f in bd.factors}
        assert "Driver Age" in names
        assert "Vehicle" in names
        assert "Claims History" in names
        assert "No-Claims Discount" in names
        assert "Telematics Score" in names

    def test_cumulative_premium_is_monotone(self, engine, driver_dan):
        """
        With all factors > 1 for Dan (high risk), cumulative premium should
        increase with each traditional factor.  Telematics may reduce it.
        """
        bd = engine.calculate(driver_dan)
        # First three factors (age, vehicle, claims) should all be > 1 → rising
        assert bd.factors[0].cumulative_premium > BASE_RATE_GBP  # age > 1
        assert bd.factors[1].cumulative_premium > bd.factors[0].cumulative_premium  # vehicle > 1
        assert bd.factors[2].cumulative_premium > bd.factors[1].cumulative_premium  # claims > 1

    def test_traditional_premium_is_higher_than_final(self, engine, driver_carol):
        """For a driver with a good telematics score, final < traditional premium."""
        # Carol: Grade C telematics (0.88 multiplier), mid-range premium — no minimum
        bd = engine.calculate(driver_carol)
        assert bd.traditional_premium > bd.final_premium

    def test_telematics_saving_is_positive(self, engine, driver_carol, driver_ben):
        for ctx in [driver_carol, driver_ben]:
            bd = engine.calculate(ctx)
            assert bd.telematics_saving >= 0

    def test_minimum_applied_for_very_low_risk(self, engine, driver_alice):
        """Alice's raw premium drops below £150 so the minimum floor kicks in."""
        bd = engine.calculate(driver_alice)
        assert bd.minimum_applied is True

    def test_minimum_not_applied_for_high_risk(self, engine, driver_dan):
        """Dan's high-risk premium is well above the minimum floor."""
        bd = engine.calculate(driver_dan)
        assert bd.minimum_applied is False

    def test_summary_is_string(self, engine, driver_carol):
        bd = engine.calculate(driver_carol)
        summary = bd.summary()
        assert isinstance(summary, str)
        assert "ANNUAL PREMIUM" in summary
        assert "Telematics" in summary

    def test_final_premium_is_rounded_to_pound(self, engine, driver_carol):
        bd = engine.calculate(driver_carol)
        assert bd.final_premium == int(bd.final_premium)


class TestNoClaimsVsClaims:
    """Demonstrates that claims have the expected multiplicative impact."""

    def test_one_claim_raises_premium_by_45_pct(self, engine, driver_carol):
        """
        Isolate the claims effect using Carol (mid-range premium, no minimum floor).
        Take her context with 0 claims vs 1 claim; ratio should be ~1.45.
        """
        import copy
        ctx_0_claims = copy.copy(driver_carol)
        ctx_0_claims.claims_last_3_years = 0

        ctx_1_claim = copy.copy(driver_carol)
        ctx_1_claim.claims_last_3_years = 1

        p0 = engine.calculate(ctx_0_claims).final_premium
        p1 = engine.calculate(ctx_1_claim).final_premium

        ratio = p1 / p0
        # Expect approximately 1.45 (the claims factor for 1 claim)
        assert 1.35 < ratio < 1.60, f"Claims ratio {ratio:.2f} outside expected range"


class TestTelematicsImpactScenario:
    """Demonstrate the telematics multiplier's effect across grade bands."""

    def test_grade_a_multiplier_lower_than_grade_d(self):
        """
        Grade A telematics multiplier (0.75) < Grade D (0.94).
        We test the multipliers directly rather than £ savings to avoid
        edge cases where the minimum floor flattens the premium for the best risks.
        """
        from rating_engine.rate_tables import telematics_multiplier
        assert telematics_multiplier(95) < telematics_multiplier(63)

    def test_grade_a_saves_more_on_high_premium(self, engine, driver_dan):
        """On a high-premium driver, the Grade A multiplier would save more £."""
        import copy
        # Give Dan (high premium) a Grade A score and compare with Grade D
        grade_a_score_dan = copy.copy(driver_dan)
        from scoring_engine.models import DriverScore
        grade_a_score_dan.driver_score = DriverScore(
            driver_id="dan_a",
            overall_score=95.0,
            acceleration_score=95.0,
            braking_score=95.0,
            speeding_score=95.0,
            daytime_score=95.0,
            nighttime_score=95.0,
            grade="A",
            credibility_weight=1.0,
        )
        saving_grade_a = engine.calculate(grade_a_score_dan).telematics_saving
        saving_grade_d = engine.calculate(driver_dan).telematics_saving
        assert saving_grade_a > saving_grade_d

    def test_no_data_costs_more_than_grade_c(self, engine, driver_carol):
        """Eve (no data) telematics factor > Carol (Grade C) telematics factor."""
        from rating_engine.factors import TelematicsFactor
        from rating_engine.rate_tables import TELEMATICS_NO_DATA_MULTIPLIER
        f_no_data = TELEMATICS_NO_DATA_MULTIPLIER
        f_carol = TelematicsFactor().apply(driver_carol)
        assert f_no_data > f_carol


class TestCustomFactorList:
    """Engine supports custom factor lists for A/B experiments."""

    def test_single_factor_engine(self, driver_alice):
        from rating_engine.factors import DriverAgeFactor
        engine = RatingEngine(factors=[DriverAgeFactor()])
        bd = engine.calculate(driver_alice)
        assert len(bd.factors) == 1
        expected = round(max(BASE_RATE_GBP * 1.00, MINIMUM_PREMIUM_GBP))
        assert bd.final_premium == expected

    def test_no_telematics_engine_equals_traditional(self, driver_dan):
        """
        An engine without TelematicsFactor: final_premium == traditional_premium.
        Use driver_dan (high premium) so the minimum floor is not triggered.
        """
        from rating_engine.factors import (
            DriverAgeFactor, VehicleFactor, ClaimsFactor, NCDFactor
        )
        engine_no_telem = RatingEngine(factors=[
            DriverAgeFactor(), VehicleFactor(), ClaimsFactor(), NCDFactor()
        ])
        bd = engine_no_telem.calculate(driver_dan)
        assert bd.final_premium == bd.traditional_premium


class TestPremiumSummaryPrint:
    """Smoke-test that summary() prints cleanly for all 5 drivers."""

    @pytest.mark.parametrize("fixture_name", [
        "driver_alice", "driver_ben", "driver_carol", "driver_dan", "driver_eve"
    ])
    def test_summary_prints(self, request, fixture_name, engine):
        ctx = request.getfixturevalue(fixture_name)
        bd = engine.calculate(ctx)
        print("\n" + bd.summary())   # visible with pytest -s
        assert bd.final_premium > 0
