"""
Pulse Insurance – Telematics Scoring Engine
============================================
Converts raw sensor events submitted by the iOS app into authoritative,
server-side driving scores.  The scoring logic deliberately mirrors the
on-device TelematicsEngine (Swift) so the driver sees consistent numbers,
but this Python version is the *canonical* score used for rating.
"""

from .models import (
    EventType,
    Severity,
    DrivingEvent,
    TripData,
    TripScore,
    DriverScore,
)
from .trip_scorer import TripScorer
from .score_aggregator import ScoreAggregator

__all__ = [
    "EventType",
    "Severity",
    "DrivingEvent",
    "TripData",
    "TripScore",
    "DriverScore",
    "TripScorer",
    "ScoreAggregator",
]
