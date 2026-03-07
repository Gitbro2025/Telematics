"""
Pulse Insurance – Actuarial Rating Engine
==========================================
Computes a risk-adjusted motor insurance premium using a multiplicative
(log-linear) rating structure:

    Premium = Base Rate  ×  Π(Traditional Factors)  ×  Telematics Multiplier

Each factor implements the RatingFactor interface so new factors can be
added without modifying the engine.

Architecture note
-----------------
This multiplicative structure IS a Generalised Linear Model (GLM) with a
log link function — the industry standard for motor rating since the 1980s
(Anderson et al., 2007; Werner & Modlin, CAS study note 2016).  Each factor
corresponds to one or more GLM coefficients.  When claims data becomes
available the coefficients can be re-fitted via MLE without changing this
module's interface.
"""

from .base import RatingFactor, RatingContext
from .engine import RatingEngine, PremiumBreakdown

__all__ = ["RatingFactor", "RatingContext", "RatingEngine", "PremiumBreakdown"]
