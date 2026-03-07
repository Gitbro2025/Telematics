"""
Shared pytest fixtures.
Five dummy driver profiles covering a wide range of risk profiles,
one for each UW-question answer bucket.
"""

from __future__ import annotations

import pytest
from datetime import date, datetime, timezone

from scoring_engine.models import (
    DrivingEvent,
    DriverScore,
    EventType,
    Severity,
    TripData,
)
from rating_engine.base import RatingContext


# ─────────────────────────────────────────────────────────────────────────────
# Helper
# ─────────────────────────────────────────────────────────────────────────────

def _dt(hour: int = 10, minute: int = 0) -> datetime:
    """Return a fixed daytime datetime for a given hour."""
    return datetime(2024, 6, 15, hour, minute, tzinfo=timezone.utc)


def make_trip(
    trip_id: str,
    driver_id: str,
    events: list[DrivingEvent],
    distance_km: float = 12.0,
    start_hour: int = 10,
    duration_minutes: int = 20,
) -> TripData:
    start = _dt(start_hour)
    end = datetime(
        start.year, start.month, start.day,
        start.hour, start.minute + duration_minutes % 60,
        tzinfo=timezone.utc,
    )
    # handle minute overflow simply
    from datetime import timedelta
    end = start + timedelta(minutes=duration_minutes)
    return TripData(
        trip_id=trip_id,
        driver_id=driver_id,
        start_time=start,
        end_time=end,
        distance_km=distance_km,
        events=events,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Dummy Driver Profiles
# ─────────────────────────────────────────────────────────────────────────────

@pytest.fixture
def driver_alice():
    """
    Alice – best-case risk profile
    --------------------------------
    • Age 35, Toyota Corolla 1.4L, 5 years NCD, 0 claims
    • Telematics score: Grade A (95)
    → Expected: very low premium, large telematics saving
    """
    score = DriverScore(
        driver_id="alice",
        overall_score=95.0,
        acceleration_score=97.0,
        braking_score=94.0,
        speeding_score=94.0,
        daytime_score=96.0,
        nighttime_score=93.0,
        total_trips=25,
        total_distance_km=420.0,
        total_driving_hours=8.5,
        grade="A",
        credibility_weight=1.0,
    )
    ctx = RatingContext(
        date_of_birth=date(1989, 3, 12),   # age 35
        vehicle_make="Toyota",
        vehicle_model="Corolla",
        engine_size_cc=1400,
        vehicle_year=2021,
        current_insurer="Aviva",
        years_with_insurer=5,
        claims_last_3_years=0,
        driver_score=score,
        policy_start_date=date(2024, 6, 15),
    )
    return ctx


@pytest.fixture
def driver_ben():
    """
    Ben – young driver, clean record, good telematics
    --------------------------------------------------
    • Age 20, Ford Fiesta 1.0L, 1 year NCD, 0 claims
    • Telematics score: Grade B (85)
    → Expected: high age loading, partially offset by good telematics
    """
    score = DriverScore(
        driver_id="ben",
        overall_score=85.0,
        acceleration_score=88.0,
        braking_score=84.0,
        speeding_score=83.0,
        daytime_score=86.0,
        nighttime_score=82.0,
        total_trips=12,
        total_distance_km=180.0,
        total_driving_hours=3.8,
        grade="B",
        credibility_weight=0.77,
    )
    ctx = RatingContext(
        date_of_birth=date(2002, 1, 20),   # age 22
        vehicle_make="Ford",
        vehicle_model="Fiesta",
        engine_size_cc=999,
        vehicle_year=2022,
        current_insurer="Hastings Direct",
        years_with_insurer=1,
        claims_last_3_years=0,
        driver_score=score,
        policy_start_date=date(2024, 6, 15),
    )
    return ctx


@pytest.fixture
def driver_carol():
    """
    Carol – mid-risk, average telematics
    -------------------------------------
    • Age 42, Volkswagen Golf 1.6L, 2 years NCD, 1 claim
    • Telematics score: Grade C (74)
    → Expected: moderate premium, slight telematics discount
    """
    score = DriverScore(
        driver_id="carol",
        overall_score=74.0,
        acceleration_score=76.0,
        braking_score=73.0,
        speeding_score=73.0,
        daytime_score=76.0,
        nighttime_score=70.0,
        total_trips=20,
        total_distance_km=310.0,
        total_driving_hours=6.2,
        grade="C",
        credibility_weight=1.0,
    )
    ctx = RatingContext(
        date_of_birth=date(1982, 8, 5),    # age 42
        vehicle_make="Volkswagen",
        vehicle_model="Golf",
        engine_size_cc=1598,
        vehicle_year=2019,
        current_insurer="Direct Line",
        years_with_insurer=2,
        claims_last_3_years=1,
        driver_score=score,
        policy_start_date=date(2024, 6, 15),
    )
    return ctx


@pytest.fixture
def driver_dan():
    """
    Dan – high-risk, poor telematics
    ---------------------------------
    • Age 23, BMW 3 Series 2.0L, 0 years NCD, 2 claims
    • Telematics score: Grade D (63)
    → Expected: very high premium (young + claims + poor driving)
    """
    score = DriverScore(
        driver_id="dan",
        overall_score=63.0,
        acceleration_score=60.0,
        braking_score=64.0,
        speeding_score=65.0,
        daytime_score=65.0,
        nighttime_score=58.0,
        total_trips=8,
        total_distance_km=95.0,
        total_driving_hours=2.1,
        grade="D",
        credibility_weight=0.63,
    )
    ctx = RatingContext(
        date_of_birth=date(2001, 11, 3),   # age 23 (just turned)
        vehicle_make="BMW",
        vehicle_model="3 Series",
        engine_size_cc=1998,
        vehicle_year=2020,
        current_insurer="Admiral",
        years_with_insurer=0,
        claims_last_3_years=2,
        driver_score=score,
        policy_start_date=date(2024, 6, 15),
    )
    return ctx


@pytest.fixture
def driver_eve():
    """
    Eve – worst-case scenario, no telematics data yet
    --------------------------------------------------
    • Age 19, BMW M3 3.0L, 0 years NCD, 3 claims
    • No telematics data (new customer)
    → Expected: very high premium, no-data surcharge applied
    """
    ctx = RatingContext(
        date_of_birth=date(2005, 4, 22),   # age 19
        vehicle_make="BMW",
        vehicle_model="M3",
        engine_size_cc=2993,
        vehicle_year=2023,
        current_insurer="Churchill",
        years_with_insurer=0,
        claims_last_3_years=3,
        driver_score=None,                  # no telematics data
        policy_start_date=date(2024, 6, 15),
    )
    return ctx


# ─────────────────────────────────────────────────────────────────────────────
# Dummy trip data for scoring engine tests
# ─────────────────────────────────────────────────────────────────────────────

@pytest.fixture
def clean_trip():
    """20-minute trip with no driving events → score 100."""
    return make_trip("t_clean", "alice", events=[], distance_km=15.0)


@pytest.fixture
def moderate_trip():
    """20-minute trip with a mix of mild and hard events."""
    events = [
        DrivingEvent(event_type=EventType.MILD_ACCELERATION, severity=Severity.LOW,
                     timestamp=_dt(10, 3), speed_kmh=45.0),
        DrivingEvent(event_type=EventType.HARD_BRAKING, severity=Severity.HIGH,
                     timestamp=_dt(10, 7), speed_kmh=60.0),
        DrivingEvent(event_type=EventType.MILD_BRAKING, severity=Severity.LOW,
                     timestamp=_dt(10, 12), speed_kmh=30.0),
        DrivingEvent(event_type=EventType.SPEEDING, severity=Severity.MEDIUM,
                     timestamp=_dt(10, 15), speed_kmh=85.0),
    ]
    return make_trip("t_moderate", "carol", events=events, distance_km=12.0)


@pytest.fixture
def terrible_trip():
    """Short trip absolutely full of hard events → score near 0."""
    # 3 hard events per category in a 2-minute trip.
    # norm = 10 / 2 = 5.0, penalty per category = 3 × 6 = 18
    # component_score = max(0, 100 − 18 × 5) = max(0, −10) = 0  → grade E
    events = [
        DrivingEvent(event_type=EventType.HARD_ACCELERATION, severity=Severity.HIGH,
                     timestamp=_dt(23, 0), speed_kmh=70.0),
        DrivingEvent(event_type=EventType.HARD_ACCELERATION, severity=Severity.HIGH,
                     timestamp=_dt(23, 0), speed_kmh=75.0),
        DrivingEvent(event_type=EventType.HARD_ACCELERATION, severity=Severity.HIGH,
                     timestamp=_dt(23, 1), speed_kmh=80.0),
        DrivingEvent(event_type=EventType.HARD_BRAKING, severity=Severity.HIGH,
                     timestamp=_dt(23, 0), speed_kmh=80.0),
        DrivingEvent(event_type=EventType.HARD_BRAKING, severity=Severity.HIGH,
                     timestamp=_dt(23, 1), speed_kmh=90.0),
        DrivingEvent(event_type=EventType.HARD_BRAKING, severity=Severity.HIGH,
                     timestamp=_dt(23, 1), speed_kmh=100.0),
        DrivingEvent(event_type=EventType.SPEEDING, severity=Severity.HIGH,
                     timestamp=_dt(23, 0), speed_kmh=110.0),
        DrivingEvent(event_type=EventType.SPEEDING, severity=Severity.HIGH,
                     timestamp=_dt(23, 1), speed_kmh=120.0),
        DrivingEvent(event_type=EventType.SPEEDING, severity=Severity.HIGH,
                     timestamp=_dt(23, 1), speed_kmh=115.0),
    ]
    return make_trip("t_terrible", "dan", events=events,
                     distance_km=2.0, start_hour=23, duration_minutes=2)
