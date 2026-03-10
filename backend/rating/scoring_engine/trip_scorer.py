"""
TripScorer
==========
Converts a TripData payload (raw events from the iOS app) into a TripScore.

Scoring methodology
-------------------
We use a **penalty-based multiplicative score** that mirrors the on-device
Swift implementation, ensuring the driver sees consistent numbers in the app:

    component_score = max(0, 100 − total_penalty × normalisation_factor)

    normalisation_factor = NORM_BASE_MINUTES / max(duration_minutes, 1)

This normalises penalties per 10 minutes of driving, making the score fair
across short and long trips.  A driver who has one hard braking event on a
5-minute trip is penalised the same as a driver with two such events on a
10-minute trip.

Weighting
---------
    overall = 0.35 × acceleration + 0.35 × braking + 0.30 × speeding

This weighting reflects actuarial loss data showing that rear-end and
loss-of-control incidents (braking / acceleration) account for ~70% of
at-fault motor claims.  The split is consistent with:
    • Admiral LittleBox (smoothness-heavy weighting)
    • Vitality Drive (braking + speed weighted equally)
    • Insurethebox (broad multi-factor, similar weight distribution)

Comparison with leading approaches
-----------------------------------
| Approach         | Pros                            | Cons                     |
|------------------|---------------------------------|--------------------------|
| Penalty model    | Interpretable, auditable        | Ignores event context    |
| (this module)    | Mirrors on-device for UX parity | No interaction effects   |
|------------------|---------------------------------|--------------------------|
| Machine learning | Captures complex interactions   | Black box, hard to audit |
| (XGBoost / NN)   | Can include phone use, cornering| Needs large training set |
|------------------|---------------------------------|--------------------------|
| GLM              | Regulatory standard, transparent| Linear assumptions       |
|                  | Easy to validate                | Interactions need coding |

The penalty model is the right starting point; it can be replaced with a
GLM or gradient-boosted model once sufficient claims data is available.
"""

from __future__ import annotations

from .models import DrivingEvent, EventType, TripData, TripScore

# Weight of each component in the overall score
WEIGHT_ACCELERATION = 0.35
WEIGHT_BRAKING = 0.35
WEIGHT_SPEEDING = 0.30

# Normalise penalties per this many minutes of driving
NORM_BASE_MINUTES = 10.0


class TripScorer:
    """Stateless scorer; instantiate once and reuse."""

    def score(self, trip: TripData) -> TripScore:
        duration_min = max(trip.duration_minutes, 1.0)
        norm = NORM_BASE_MINUTES / duration_min

        # Separate events by category
        accel_events = [
            e for e in trip.events
            if e.event_type in (EventType.HARD_ACCELERATION, EventType.MILD_ACCELERATION)
        ]
        brake_events = [
            e for e in trip.events
            if e.event_type in (EventType.HARD_BRAKING, EventType.MILD_BRAKING)
        ]
        speed_events = [
            e for e in trip.events
            if e.event_type == EventType.SPEEDING
        ]

        accel_penalty = sum(e.severity.penalty_points for e in accel_events)
        brake_penalty = sum(e.severity.penalty_points for e in brake_events)
        speed_penalty = sum(e.severity.penalty_points for e in speed_events)

        accel_score = max(0.0, 100.0 - accel_penalty * norm)
        brake_score = max(0.0, 100.0 - brake_penalty * norm)
        speed_score = max(0.0, 100.0 - speed_penalty * norm)

        overall = (
            WEIGHT_ACCELERATION * accel_score
            + WEIGHT_BRAKING * brake_score
            + WEIGHT_SPEEDING * speed_score
        )

        return TripScore(
            trip_id=trip.trip_id,
            driver_id=trip.driver_id,
            start_time=trip.start_time,
            distance_km=trip.distance_km,
            duration_minutes=duration_min,
            time_of_day=trip.time_of_day,
            acceleration_score=round(accel_score, 2),
            braking_score=round(brake_score, 2),
            speeding_score=round(speed_score, 2),
            overall_score=round(overall, 2),
            grade=TripScore.grade_from_score(overall),
            hard_acceleration_count=sum(
                1 for e in accel_events if e.event_type == EventType.HARD_ACCELERATION
            ),
            mild_acceleration_count=sum(
                1 for e in accel_events if e.event_type == EventType.MILD_ACCELERATION
            ),
            hard_braking_count=sum(
                1 for e in brake_events if e.event_type == EventType.HARD_BRAKING
            ),
            mild_braking_count=sum(
                1 for e in brake_events if e.event_type == EventType.MILD_BRAKING
            ),
            speeding_count=len(speed_events),
        )
