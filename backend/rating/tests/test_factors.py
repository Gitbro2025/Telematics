"""
Tests for individual rating factors.
"""
import pytest
from rating_engine.factors import (
    ClaimsFactor,
    DriverAgeFactor,
    NCDFactor,
    TelematicsFactor,
    VehicleFactor,
)
from rating_engine.rate_tables import (
    TELEMATICS_NO_DATA_MULTIPLIER,
    engine_size_factor,
    ncd_factor,
    claims_factor,
    age_factor,
    vehicle_risk_group,
    vehicle_factor_from_group,
)


# ─────────────────────────────────────────────────────────────────────────────
# Rate table unit tests
# ─────────────────────────────────────────────────────────────────────────────

class TestAgeFactor:
    @pytest.mark.parametrize("age, expected", [
        (17, 2.80), (21, 2.80),    # young band
        (22, 1.90), (25, 1.90),
        (30, 1.00), (49, 1.00),    # standard
        (50, 0.92), (64, 0.92),    # mature discount
        (65, 1.05), (69, 1.05),
        (70, 1.28), (85, 1.28),    # elderly loading
    ])
    def test_age_bands(self, age, expected):
        assert age_factor(age) == pytest.approx(expected)

    def test_invalid_age_raises(self):
        with pytest.raises(ValueError):
            age_factor(16)


class TestEngineSizeFactor:
    @pytest.mark.parametrize("cc, expected", [
        (999,  0.85),   # up to 1000cc
        (1000, 0.85),
        (1001, 0.95),   # 1001–1400
        (1400, 0.95),
        (1401, 1.00),   # 1401–1800 – standard
        (1800, 1.00),
        (1801, 1.18),   # 1801–2500
        (2500, 1.18),
        (2501, 1.42),   # over 2500cc
        (5000, 1.42),
    ])
    def test_engine_bands(self, cc, expected):
        assert engine_size_factor(cc) == pytest.approx(expected)


class TestNCDFactor:
    @pytest.mark.parametrize("years, expected", [
        (0, 1.00),
        (1, 0.70),
        (2, 0.60),
        (3, 0.50),
        (4, 0.40),
        (5, 0.35),
        (10, 0.35),   # capped at 5+
    ])
    def test_ncd_ladder(self, years, expected):
        assert ncd_factor(years) == pytest.approx(expected)

    def test_ncd_is_always_discount_or_neutral(self):
        for y in range(0, 11):
            assert ncd_factor(y) <= 1.00


class TestClaimsFactor:
    @pytest.mark.parametrize("n, expected", [
        (0, 1.00),
        (1, 1.45),
        (2, 2.10),
        (3, 3.20),
        (4, 4.50),
        (5, 4.50),    # capped
        (10, 4.50),
    ])
    def test_claims_loading(self, n, expected):
        assert claims_factor(n) == pytest.approx(expected)

    def test_claims_always_loading(self):
        for n in range(1, 6):
            assert claims_factor(n) > 1.00


class TestVehicleRiskGroup:
    @pytest.mark.parametrize("make, model, expected_group", [
        ("Toyota",     "Aygo",     4),
        ("Toyota",     "GR86",    32),
        ("BMW",        "M3",      47),
        ("Ford",       "Fiesta",   9),
        ("Volkswagen", "Golf GTI",36),
        ("Vauxhall",   "Corsa",    7),
    ])
    def test_known_models(self, make, model, expected_group):
        assert vehicle_risk_group(make, model) == expected_group

    def test_unknown_model_raises(self):
        with pytest.raises(ValueError):
            vehicle_risk_group("Toyota", "NonExistent")

    def test_unknown_make_raises(self):
        with pytest.raises(ValueError):
            vehicle_risk_group("Ferrari", "SF90")

    def test_factor_increases_with_group(self):
        """Higher risk group → higher vehicle factor."""
        low_f = vehicle_factor_from_group(5)
        high_f = vehicle_factor_from_group(40)
        assert high_f > low_f

    def test_group_15_is_approximately_neutral(self):
        """Group 15 ≈ 1.00 per calibration note in rate_tables."""
        f = vehicle_factor_from_group(15)
        assert 0.90 <= f <= 1.15   # near neutral within 15%


# ─────────────────────────────────────────────────────────────────────────────
# Factor class tests (on full RatingContext via fixtures)
# ─────────────────────────────────────────────────────────────────────────────

class TestDriverAgeFactorClass:
    def test_alice_standard_age(self, driver_alice):
        f = DriverAgeFactor().apply(driver_alice)
        assert f == pytest.approx(1.00)   # Alice is 35

    def test_ben_young_driver(self, driver_ben):
        f = DriverAgeFactor().apply(driver_ben)
        assert f == pytest.approx(1.90)   # Ben is 20

    def test_eve_youngest(self, driver_eve):
        f = DriverAgeFactor().apply(driver_eve)
        assert f == pytest.approx(2.80)   # Eve is 19


class TestVehicleFactorClass:
    def test_returns_positive(self, driver_alice):
        f = VehicleFactor().apply(driver_alice)
        assert f > 0

    def test_bmw_m3_higher_than_toyota_aygo(self, driver_alice, driver_eve):
        # Alice: Toyota Corolla; Eve: BMW M3
        f_alice = VehicleFactor().apply(driver_alice)
        f_eve = VehicleFactor().apply(driver_eve)
        assert f_eve > f_alice

    def test_high_cc_higher_than_low(self, driver_ben, driver_dan):
        # Ben: Ford Fiesta 999cc; Dan: BMW 3 Series 2000cc
        f_ben = VehicleFactor().apply(driver_ben)
        f_dan = VehicleFactor().apply(driver_dan)
        assert f_dan > f_ben


class TestClaimsFactorClass:
    def test_zero_claims_neutral(self, driver_alice):
        f = ClaimsFactor().apply(driver_alice)
        assert f == pytest.approx(1.00)

    def test_one_claim_loaded(self, driver_carol):
        f = ClaimsFactor().apply(driver_carol)
        assert f == pytest.approx(1.45)

    def test_two_claims_heavily_loaded(self, driver_dan):
        f = ClaimsFactor().apply(driver_dan)
        assert f == pytest.approx(2.10)


class TestNCDFactorClass:
    def test_5yr_ncd(self, driver_alice):
        f = NCDFactor().apply(driver_alice)
        assert f == pytest.approx(0.35)   # 65% discount

    def test_0yr_ncd(self, driver_dan):
        f = NCDFactor().apply(driver_dan)
        assert f == pytest.approx(1.00)   # no discount


class TestTelematicsFactorClass:
    def test_grade_a_discount(self, driver_alice):
        f = TelematicsFactor().apply(driver_alice)
        assert f == pytest.approx(0.75)   # Alice score = 95

    def test_grade_b_discount(self, driver_ben):
        f = TelematicsFactor().apply(driver_ben)
        assert f == pytest.approx(0.82)   # Ben score = 85

    def test_grade_c_small_discount(self, driver_carol):
        f = TelematicsFactor().apply(driver_carol)
        assert f == pytest.approx(0.88)   # Carol score = 74

    def test_grade_d_minimal_discount(self, driver_dan):
        f = TelematicsFactor().apply(driver_dan)
        assert f == pytest.approx(0.94)   # Dan score = 63

    def test_no_data_surcharge(self, driver_eve):
        f = TelematicsFactor().apply(driver_eve)
        assert f == pytest.approx(TELEMATICS_NO_DATA_MULTIPLIER)   # Eve = no data

    def test_telematics_always_between_zero_and_two(self):
        from scoring_engine.models import DriverScore
        from rating_engine.base import RatingContext
        from datetime import date
        for score_val in [0, 25, 50, 60, 70, 80, 90, 100]:
            ds = DriverScore(
                driver_id="x",
                overall_score=float(score_val),
                acceleration_score=float(score_val),
                braking_score=float(score_val),
                speeding_score=float(score_val),
                daytime_score=float(score_val),
                nighttime_score=float(score_val),
                grade="A",
                credibility_weight=1.0,
            )
            ctx = RatingContext(
                date_of_birth=date(1985, 1, 1),
                vehicle_make="Ford",
                vehicle_model="Focus",
                engine_size_cc=1600,
                vehicle_year=2020,
                current_insurer="Aviva",
                years_with_insurer=3,
                claims_last_3_years=0,
                driver_score=ds,
            )
            f = TelematicsFactor().apply(ctx)
            assert 0.0 < f <= 2.0
