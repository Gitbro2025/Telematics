"""
VehicleFactor
=============
Combines three vehicle attributes into a single multiplier:
  1. Model risk group  (Thatcham / ABI group proxy)
  2. Engine size band  (cc → band factor)
  3. Vehicle age       (older vehicles can be cheaper to insure but have
                        higher mechanical failure risk; net effect is slight
                        discount for 3–7 year old vehicles vs new or old)

Combined factor = model_factor × engine_factor × age_factor

Actuarial basis
---------------
Vehicle factors are the single largest driver of premium variation after
driver age (Guidewire Radar analysis, UK personal lines 2022).  The ABI
group system is used by ~95% of UK insurers as a standardised vehicle risk
classification.
"""

from __future__ import annotations

from ..base import RatingContext, RatingFactor
from ..rate_tables import (
    engine_size_factor,
    vehicle_factor_from_group,
    vehicle_risk_group,
)


def _vehicle_age_factor(age_years: int) -> float:
    """
    Vehicle age multiplier.
    New cars (0–2 yrs): higher repair costs           → 1.08
    Mid-age (3–7 yrs):  sweet spot, reliable + cheap  → 0.96
    Older (8–12 yrs):   rising mechanical risk        → 1.02
    Very old (13+ yrs): high failure rate              → 1.12
    """
    if age_years <= 2:
        return 1.08
    if age_years <= 7:
        return 0.96
    if age_years <= 12:
        return 1.02
    return 1.12


class VehicleFactor(RatingFactor):
    @property
    def name(self) -> str:
        return "Vehicle"

    def apply(self, ctx: RatingContext) -> float:
        group = vehicle_risk_group(ctx.vehicle_make, ctx.vehicle_model)
        model_f = vehicle_factor_from_group(group)
        engine_f = engine_size_factor(ctx.engine_size_cc)
        age_f = _vehicle_age_factor(ctx.vehicle_age_years)
        return round(model_f * engine_f * age_f, 4)
