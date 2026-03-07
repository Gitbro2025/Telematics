"""
RatingFactor – abstract base class
===================================
Every factor (traditional or telematics) implements this single interface.
The engine simply multiplies all factors together, so:
  - Adding a new factor = one new file + one line in engine.py
  - Removing a factor = one line in engine.py (no other changes)
  - Auditing a factor = read one file
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import date
from typing import Optional

from scoring_engine.models import DriverScore


@dataclass
class RatingContext:
    """
    All underwriting inputs available at quote time.
    Populated from the sign-up form and the driver's telematics score.

    The 5 dropdown options for each field are enforced in rate_tables.py.
    """

    # ── Driver ────────────────────────────────────────────────────────────
    date_of_birth: date
    """Driver's date of birth (used to derive age at policy inception)."""

    # ── Vehicle ───────────────────────────────────────────────────────────
    vehicle_make: str
    """One of the 5 supported makes (see rate_tables.VEHICLE_MAKES)."""

    vehicle_model: str
    """One of the 5 supported models for the selected make."""

    engine_size_cc: int
    """Engine displacement in cc.  Maps to one of 5 engine-size bands."""

    vehicle_year: int
    """Year of manufacture.  Used to derive vehicle age."""

    # ── Insurance history ─────────────────────────────────────────────────
    current_insurer: str
    """One of the 5 supported insurers (see rate_tables.INSURERS)."""

    years_with_insurer: int
    """0–5+. Used as a No-Claims Discount (NCD) proxy."""

    claims_last_3_years: int
    """Number of claims in the last 3 years (0–4+)."""

    # ── Telematics ────────────────────────────────────────────────────────
    driver_score: Optional[DriverScore] = None
    """
    Aggregated driving score.  None during the initial telematics period
    (first 30 days / <5 trips), in which case the telematics factor defaults
    to a neutral loading of 1.05 (slight surcharge for no data).
    """

    # ── Policy ────────────────────────────────────────────────────────────
    policy_start_date: date = field(default_factory=date.today)

    @property
    def driver_age(self) -> int:
        today = self.policy_start_date
        age = today.year - self.date_of_birth.year
        if (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day):
            age -= 1
        return age

    @property
    def vehicle_age_years(self) -> int:
        return self.policy_start_date.year - self.vehicle_year


class RatingFactor(ABC):
    """
    Abstract base for all rating factors.

    A factor returns a *multiplier* ≥ 0.  The engine multiplies all
    factors together to arrive at the final premium.

      multiplier < 1.0  → discount
      multiplier = 1.0  → neutral (no effect)
      multiplier > 1.0  → loading (surcharge)
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Human-readable factor name for the premium breakdown."""

    @abstractmethod
    def apply(self, ctx: RatingContext) -> float:
        """
        Return the rating multiplier for this factor given the context.
        Must be ≥ 0.  Raise ValueError for invalid / unsupported input values.
        """
