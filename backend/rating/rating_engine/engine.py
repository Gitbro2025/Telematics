"""
RatingEngine
============
Assembles all factors and computes the final annual premium.

Premium formula
---------------
    Premium = Base Rate  ×  Π(factors)

where factors are applied in the order:
  1. Driver Age
  2. Vehicle (make/model/engine/age combined)
  3. Claims History
  4. No-Claims Discount
  5. Telematics Score   ← the only factor that changes mid-term

This order is irrelevant mathematically (multiplication is commutative)
but matches the conventional actuarial breakdown order used in UK personal
lines filings.

Minimum premium
---------------
A floor of £150 is applied regardless of discounts.  This covers the
insurer's fixed administration costs and prevents extreme under-pricing
for very clean risks.

Maximum premium
---------------
No ceiling is applied.  High-risk profiles (young driver, multiple claims,
poor telematics) can legitimately attract high premiums; a hard cap would
create adverse selection at the tail.  Referral logic (not in scope here)
should be applied at, say, £5,000+ to route to a specialist underwriter.

Rounding
--------
The final premium is rounded to the nearest £1, consistent with standard
UK insurance pricing practice.

Methodology note: GLM equivalence
------------------------------------
This engine is a Generalised Linear Model (GLM) with:
  - Link function:  log  (i.e. ln(premium) = sum of log-factors)
  - Distribution:   assumed Gamma or Poisson (to be fitted from claims data)
  - Predictors:     age, vehicle, claims, NCD, telematics score

When sufficient claims data is available, the factor values in rate_tables.py
can be replaced with MLE-fitted GLM coefficients without any code changes.
This is the standard refitting cycle used by Guidewire Radar, Earnix, and
Willis Towers Watson Radar (now WTW).
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .base import RatingContext, RatingFactor
from .factors import (
    ClaimsFactor,
    DriverAgeFactor,
    NCDFactor,
    TelematicsFactor,
    VehicleFactor,
)
from .rate_tables import BASE_RATE_GBP

MINIMUM_PREMIUM_GBP: float = 150.0


@dataclass
class FactorResult:
    """One factor's contribution to the final premium."""
    name: str
    multiplier: float
    cumulative_premium: float   # running premium after this factor applied


@dataclass
class PremiumBreakdown:
    """
    Full transparent breakdown of how the premium was calculated.
    Useful for:
      • Customer-facing quote explanations
      • Underwriter review
      • Regulatory audit trail
    """
    base_rate: float
    factors: list[FactorResult]
    raw_premium: float          # before minimum floor
    final_premium: float        # after minimum floor + rounding
    minimum_applied: bool

    @property
    def traditional_premium(self) -> float:
        """Premium from traditional factors only (without telematics)."""
        running = self.base_rate
        for fr in self.factors:
            if fr.name == "Telematics Score":
                break
            running *= fr.multiplier
        return round(running)

    @property
    def telematics_saving(self) -> float:
        """£ saving attributable to the telematics factor."""
        return max(0.0, round(self.traditional_premium - self.final_premium))

    @property
    def telematics_multiplier(self) -> float:
        for fr in self.factors:
            if fr.name == "Telematics Score":
                return fr.multiplier
        return 1.0

    def summary(self) -> str:
        lines = [
            "─" * 52,
            f"  Pulse Insurance – Premium Breakdown",
            "─" * 52,
            f"  Base rate                     £{self.base_rate:>8.2f}",
        ]
        for fr in self.factors:
            sign = "×"
            lines.append(
                f"  {fr.name:<28} {sign} {fr.multiplier:>6.4f}"
                f"   → £{fr.cumulative_premium:>7.2f}"
            )
        lines += [
            "─" * 52,
            f"  Raw premium                   £{self.raw_premium:>8.2f}",
        ]
        if self.minimum_applied:
            lines.append(f"  Minimum premium applied        £{MINIMUM_PREMIUM_GBP:>8.2f}")
        lines += [
            f"  {'ANNUAL PREMIUM':28}   £{self.final_premium:>7.2f}",
            "─" * 52,
            f"  Traditional premium            £{self.traditional_premium:>8.2f}",
            f"  Telematics saving              £{self.telematics_saving:>8.2f}",
            "─" * 52,
        ]
        return "\n".join(lines)


class RatingEngine:
    """
    Compute an annual premium for a given RatingContext.

    Usage::

        engine = RatingEngine()
        breakdown = engine.calculate(ctx)
        print(breakdown.summary())
        print(f"Annual premium: £{breakdown.final_premium}")

    To add a new factor, implement RatingFactor and add it to
    _default_factors() in the correct position.
    """

    def __init__(self, factors: list[RatingFactor] | None = None):
        """
        Pass a custom factor list for testing or A/B pricing experiments.
        Defaults to the standard Pulse Insurance factor set.
        """
        self._factors: list[RatingFactor] = factors if factors is not None else _default_factors()

    def calculate(self, ctx: RatingContext) -> PremiumBreakdown:
        running = BASE_RATE_GBP
        factor_results: list[FactorResult] = []

        for factor in self._factors:
            m = factor.apply(ctx)
            running *= m
            factor_results.append(
                FactorResult(
                    name=factor.name,
                    multiplier=round(m, 4),
                    cumulative_premium=round(running, 2),
                )
            )

        raw_premium = running
        minimum_applied = raw_premium < MINIMUM_PREMIUM_GBP
        final_premium = float(round(max(raw_premium, MINIMUM_PREMIUM_GBP)))

        return PremiumBreakdown(
            base_rate=BASE_RATE_GBP,
            factors=factor_results,
            raw_premium=round(raw_premium, 2),
            final_premium=final_premium,
            minimum_applied=minimum_applied,
        )


def _default_factors() -> list[RatingFactor]:
    """
    Standard Pulse Insurance factor set.
    Traditional factors first, telematics last — so traditional_premium
    can be read directly from the breakdown without re-running the engine.
    """
    return [
        DriverAgeFactor(),
        VehicleFactor(),
        ClaimsFactor(),
        NCDFactor(),
        TelematicsFactor(),
    ]
