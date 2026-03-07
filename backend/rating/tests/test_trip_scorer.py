"""
Tests for TripScorer
"""
import pytest
from scoring_engine import TripScorer
from scoring_engine.models import DrivingEvent, EventType, Severity
from tests.conftest import _dt, make_trip


@pytest.fixture
def scorer():
    return TripScorer()


class TestCleanTrip:
    def test_perfect_score(self, scorer, clean_trip):
        result = scorer.score(clean_trip)
        assert result.overall_score == 100.0
        assert result.acceleration_score == 100.0
        assert result.braking_score == 100.0
        assert result.speeding_score == 100.0

    def test_grade_a(self, scorer, clean_trip):
        result = scorer.score(clean_trip)
        assert result.grade == "A"

    def test_zero_event_counts(self, scorer, clean_trip):
        result = scorer.score(clean_trip)
        assert result.hard_acceleration_count == 0
        assert result.hard_braking_count == 0
        assert result.speeding_count == 0

    def test_trip_metadata_preserved(self, scorer, clean_trip):
        result = scorer.score(clean_trip)
        assert result.trip_id == clean_trip.trip_id
        assert result.driver_id == clean_trip.driver_id
        assert result.distance_km == clean_trip.distance_km


class TestModerateTrip:
    def test_scores_are_penalised(self, scorer, moderate_trip):
        result = scorer.score(moderate_trip)
        assert result.overall_score < 100.0
        assert result.braking_score < 100.0    # had hard braking
        assert result.speeding_score < 100.0   # had speeding

    def test_event_counts(self, scorer, moderate_trip):
        result = scorer.score(moderate_trip)
        assert result.hard_braking_count == 1
        assert result.mild_braking_count == 1
        assert result.mild_acceleration_count == 1
        assert result.speeding_count == 1

    def test_daytime_classification(self, scorer, moderate_trip):
        result = scorer.score(moderate_trip)
        assert result.time_of_day == "daytime"


class TestTerribleTrip:
    def test_scores_near_zero(self, scorer, terrible_trip):
        result = scorer.score(terrible_trip)
        assert result.overall_score < 30.0

    def test_grade_e(self, scorer, terrible_trip):
        result = scorer.score(terrible_trip)
        assert result.grade == "E"

    def test_nighttime_classification(self, scorer, terrible_trip):
        result = scorer.score(terrible_trip)
        assert result.time_of_day == "nighttime"

    def test_hard_event_counts(self, scorer, terrible_trip):
        result = scorer.score(terrible_trip)
        assert result.hard_acceleration_count == 3
        assert result.hard_braking_count == 3
        assert result.speeding_count == 3


class TestNormalisationFairness:
    """
    Longer trips should not be unfairly penalised relative to short trips
    with the same events.
    """

    def test_same_events_short_vs_long(self, scorer):
        event = DrivingEvent(
            event_type=EventType.HARD_BRAKING,
            severity=Severity.HIGH,
            timestamp=_dt(10, 5),
            speed_kmh=60.0,
        )

        # 5-minute trip with 1 hard brake
        short = make_trip("short", "x", [event], distance_km=3.0, duration_minutes=5)
        # 50-minute trip with 1 hard brake
        long_ = make_trip("long", "x", [event], distance_km=30.0, duration_minutes=50)

        short_score = scorer.score(short)
        long_score = scorer.score(long_)

        # The long trip should have a HIGHER (better) braking score because the
        # same penalty is spread over more minutes of driving
        assert long_score.braking_score > short_score.braking_score

    def test_score_floor_is_zero(self, scorer):
        """Score cannot go below 0 regardless of penalties."""
        events = [
            DrivingEvent(
                event_type=EventType.HARD_BRAKING, severity=Severity.HIGH,
                timestamp=_dt(10, i), speed_kmh=80.0
            )
            for i in range(20)
        ]
        trip = make_trip("floored", "x", events, duration_minutes=5)
        result = scorer.score(trip)
        assert result.overall_score >= 0.0
        assert result.braking_score >= 0.0


class TestGradeBoundaries:
    """Grade boundaries are at 90/80/70/60."""

    @pytest.mark.parametrize("score, expected_grade", [
        (100.0, "A"), (90.0, "A"),
        (89.9,  "B"), (80.0, "B"),
        (79.9,  "C"), (70.0, "C"),
        (69.9,  "D"), (60.0, "D"),
        (59.9,  "E"), (0.0,  "E"),
    ])
    def test_grade_from_score(self, score, expected_grade):
        from scoring_engine.models import TripScore
        assert TripScore.grade_from_score(score) == expected_grade
