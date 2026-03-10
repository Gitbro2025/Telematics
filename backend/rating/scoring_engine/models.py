"""
Data models for the telematics scoring engine.
All models are Pydantic v2 for automatic validation and JSON serialisation.
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, model_validator


class EventType(str, Enum):
    HARD_ACCELERATION = "hard_acceleration"
    MILD_ACCELERATION = "mild_acceleration"
    HARD_BRAKING = "hard_braking"
    MILD_BRAKING = "mild_braking"
    SPEEDING = "speeding"


class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

    @property
    def penalty_points(self) -> float:
        """
        Penalty point scale.  Chosen to be consistent with the iOS app and
        calibrated so that a driver with ~2 hard events per 10-minute drive
        scores roughly 75 (Grade C).
        """
        return {"low": 1.0, "medium": 3.0, "high": 6.0}[self.value]


class DrivingEvent(BaseModel):
    """A single detected driving infraction submitted from the iOS app."""

    event_type: EventType
    severity: Severity
    timestamp: datetime
    speed_kmh: float = Field(ge=0)
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class TripData(BaseModel):
    """
    A complete trip payload as received from the iOS app after the driver
    stops recording.
    """

    trip_id: str
    driver_id: str
    start_time: datetime
    end_time: datetime
    distance_km: float = Field(ge=0)
    events: list[DrivingEvent] = Field(default_factory=list)

    @model_validator(mode="after")
    def end_after_start(self) -> "TripData":
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be after start_time")
        return self

    @property
    def duration_seconds(self) -> float:
        return (self.end_time - self.start_time).total_seconds()

    @property
    def duration_minutes(self) -> float:
        return self.duration_seconds / 60.0

    @property
    def time_of_day(self) -> str:
        """Daytime = 07:00–20:59 local hour of trip start."""
        hour = self.start_time.hour
        return "daytime" if 7 <= hour < 21 else "nighttime"


class TripScore(BaseModel):
    """Server-authoritative score for a single trip."""

    trip_id: str
    driver_id: str
    start_time: datetime
    distance_km: float
    duration_minutes: float
    time_of_day: str

    # Component scores  (0–100 each)
    acceleration_score: float = Field(ge=0, le=100)
    braking_score: float = Field(ge=0, le=100)
    speeding_score: float = Field(ge=0, le=100)

    # Weighted overall
    overall_score: float = Field(ge=0, le=100)
    grade: str  # A / B / C / D / E

    # Event counts for transparency
    hard_acceleration_count: int = 0
    mild_acceleration_count: int = 0
    hard_braking_count: int = 0
    mild_braking_count: int = 0
    speeding_count: int = 0

    @staticmethod
    def grade_from_score(score: float) -> str:
        if score >= 90:
            return "A"
        if score >= 80:
            return "B"
        if score >= 70:
            return "C"
        if score >= 60:
            return "D"
        return "E"


class DriverScore(BaseModel):
    """
    Aggregated score across all recorded trips for a single driver.
    This is the value fed into the telematics rating factor.
    """

    driver_id: str
    overall_score: float = Field(ge=0, le=100)
    acceleration_score: float = Field(ge=0, le=100)
    braking_score: float = Field(ge=0, le=100)
    speeding_score: float = Field(ge=0, le=100)

    daytime_score: float = Field(ge=0, le=100)
    nighttime_score: float = Field(ge=0, le=100)

    total_trips: int = 0
    total_distance_km: float = 0.0
    total_driving_hours: float = 0.0

    grade: str = "E"
    credibility_weight: float = Field(
        ge=0.0,
        le=1.0,
        description=(
            "Credibility weight (0–1). Blends individual score with the "
            "population mean.  Reaches 1.0 at ~20 trips (full credibility)."
        ),
    )
