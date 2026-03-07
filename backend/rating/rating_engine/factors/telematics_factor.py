"""
TelematicsFactor
================
The telematics multiplier is the only factor that can change *during* the
policy year as the driver accumulates trips.  All other factors are fixed
at inception.

Design decisions
----------------
1. **Grade E surcharge (1.10)**
   Poor drivers are not just neutral — they are actively adverse risks.
   A 10% surcharge for Grade E is conservative but actuarially defensible.
   Vitality Drive and Ingenie both apply loadings for consistently poor
   driving behaviour.

2. **No-data surcharge (1.05)**
   Drivers who don't use the app are slightly adversely selected.
   This also incentivises app engagement.

3. **Independence from traditional factors**
   Telematics measures *how* you drive; traditional factors measure *who*
   you are and *what* you drive.  They are largely orthogonal, so
   multiplying them is correct (no interaction term needed at this stage).

4. **Credibility blending (handled in ScoreAggregator)**
   The DriverScore fed into this factor already incorporates credibility
   weighting (blended with population mean for drivers with < 20 trips).
   This factor simply reads the blended score — no additional adjustment
   is needed here.

Comparison with leading approaches
------------------------------------
| Insurer          | Telematics discount range | No-data handling         |
|------------------|---------------------------|--------------------------|
| Admiral LittleBox| Up to 25%                 | Neutral (no surcharge)   |
| Marmalade        | Up to 30%                 | Slight loading           |
| Vitality Drive   | Up to 20%                 | Loading + penalties      |
| Pulse Insurance  | Up to 25%                 | 5% surcharge (this file) |

Our approach is positioned between Admiral (lenient) and Vitality (strict).
"""

from __future__ import annotations

from ..base import RatingContext, RatingFactor
from ..rate_tables import TELEMATICS_NO_DATA_MULTIPLIER, telematics_multiplier


class TelematicsFactor(RatingFactor):
    @property
    def name(self) -> str:
        return "Telematics Score"

    def apply(self, ctx: RatingContext) -> float:
        if ctx.driver_score is None:
            return TELEMATICS_NO_DATA_MULTIPLIER
        return telematics_multiplier(ctx.driver_score.overall_score)
