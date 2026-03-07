"""
NCDFactor  (No-Claims Discount)
================================
The UK NCD ladder is the most widely used rating mechanism in UK personal
motor lines.  We use years-with-current-insurer as a proxy, which is a
reasonable approximation because:
  1. Most drivers do not switch insurers mid-claims-free streak
  2. It is directly collected in the sign-up form
  3. It can be verified against the Motor Insurance Database (MID)

Standard UK NCD ladder (used by Admiral, Aviva, Direct Line, AXA):
  0 yrs → 0%,  1 yr → 30%,  2 yrs → 40%,  3 yrs → 50%,
  4 yrs → 60%, 5+ yrs → 65%

Our factors mirror this ladder exactly.  A future enhancement would be to
verify claimed NCD via a CUE lookup and flag discrepancies.

Interaction with telematics
----------------------------
NCD and telematics are independent factors (both multiplied together).
This is consistent with how Marmalade and Admiral LittleBox handle NCD —
the telematics discount is additive to NCD, not a replacement for it.
"""

from __future__ import annotations

from ..base import RatingContext, RatingFactor
from ..rate_tables import ncd_factor as _ncd_factor


class NCDFactor(RatingFactor):
    @property
    def name(self) -> str:
        return "No-Claims Discount"

    def apply(self, ctx: RatingContext) -> float:
        return _ncd_factor(ctx.years_with_insurer)
