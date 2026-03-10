"""
ClaimsFactor
============
Claims history is the second strongest predictor of future claims
(after driver age).  The "propensity to claim" is highly persistent:
drivers who have claimed once are approximately 1.4–1.6× as likely to
claim again within 3 years (CUE data, ABI 2022).

Our table treats all declared claims as fault claims (conservative).
In production, the sign-up form can be extended to capture fault/non-fault
split, and the factors adjusted accordingly (non-fault loading is typically
0.05–0.15 per claim rather than 0.45).

Note: claims are capped at 4+ for rating; the actual number is stored on
the customer record for referral/decline decisions.
"""

from __future__ import annotations

from ..base import RatingContext, RatingFactor
from ..rate_tables import claims_factor as _claims_factor


class ClaimsFactor(RatingFactor):
    @property
    def name(self) -> str:
        return "Claims History"

    def apply(self, ctx: RatingContext) -> float:
        return _claims_factor(ctx.claims_last_3_years)
