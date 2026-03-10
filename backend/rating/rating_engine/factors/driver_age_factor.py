"""
DriverAgeFactor
===============
Driver age is the most powerful predictor of motor claim frequency.

The U-shaped relationship (high risk at 17–25, low at 30–64, rising again
at 70+) is well-established across all major markets:
  • UK: DVLA / Confused.com average premium data (2023)
  • EU: EIOPA motor premium statistics (2022)
  • US: IIHS fatality rate data (2022)

Young driver surcharges are typically 2–4× the standard rate. Our factors
are conservative at the lower end to remain competitive while still
reflecting actuarial reality.
"""

from __future__ import annotations

from ..base import RatingContext, RatingFactor
from ..rate_tables import age_factor


class DriverAgeFactor(RatingFactor):
    @property
    def name(self) -> str:
        return "Driver Age"

    def apply(self, ctx: RatingContext) -> float:
        return age_factor(ctx.driver_age)
