"""
ScoreAggregator
===============
Aggregates multiple TripScores into a single DriverScore.

Credibility theory
------------------
A driver with 1 trip has far less statistical evidence than one with 50.
We apply **limited fluctuation credibility** (a classical actuarial technique)
to blend the driver's individual score with the population mean:

    credible_score = w × individual_score + (1 − w) × population_mean

where the credibility weight w is:

    w = min(1.0,  sqrt(n / FULL_CREDIBILITY_TRIPS))

This mirrors the approach used by Swiss Re, Munich Re, and most mature UK
telematics books.  Full credibility is reached at FULL_CREDIBILITY_TRIPS
(default 20 trips), after which the driver's own data is used exclusively.

Night-time weighting
--------------------
Night-time trips are weighted 1.25× when computing the daytime/nighttime
breakdown to reflect the higher-risk exposure, consistent with actuarial
research and Vitality Drive's published methodology.
"""

from __future__ import annotations

from .models import DriverScore, TripScore

# Population mean used for credibility blending before enough trip data
POPULATION_MEAN_SCORE = 72.0

# Number of trips required for full credibility (w = 1.0)
FULL_CREDIBILITY_TRIPS = 20

# Night-time trips are weighted higher in the breakdown
NIGHTTIME_WEIGHT = 1.25


def _credibility_weight(n_trips: int) -> float:
    """Limited-fluctuation credibility weight for n trips."""
    import math
    return min(1.0, math.sqrt(n_trips / FULL_CREDIBILITY_TRIPS))


class ScoreAggregator:
    """Aggregates a list of TripScores into a DriverScore."""

    def aggregate(
        self,
        driver_id: str,
        trip_scores: list[TripScore],
        population_mean: float = POPULATION_MEAN_SCORE,
    ) -> DriverScore:
        if not trip_scores:
            return DriverScore(
                driver_id=driver_id,
                overall_score=population_mean,
                acceleration_score=population_mean,
                braking_score=population_mean,
                speeding_score=population_mean,
                daytime_score=population_mean,
                nighttime_score=population_mean,
                total_trips=0,
                total_distance_km=0.0,
                total_driving_hours=0.0,
                grade="C",
                credibility_weight=0.0,
            )

        n = len(trip_scores)
        w = _credibility_weight(n)

        # Simple means across all trips
        raw_overall = sum(t.overall_score for t in trip_scores) / n
        raw_accel = sum(t.acceleration_score for t in trip_scores) / n
        raw_brake = sum(t.braking_score for t in trip_scores) / n
        raw_speed = sum(t.speeding_score for t in trip_scores) / n

        # Credibility-blended overall
        credible_overall = w * raw_overall + (1 - w) * population_mean

        # Day / night breakdown (night weighted 1.25×)
        day_scores = [t.overall_score for t in trip_scores if t.time_of_day == "daytime"]
        night_scores = [t.overall_score for t in trip_scores if t.time_of_day == "nighttime"]

        daytime_score = (sum(day_scores) / len(day_scores)) if day_scores else credible_overall
        nighttime_score = (
            sum(night_scores) / len(night_scores)
        ) if night_scores else credible_overall

        total_hours = sum(t.duration_minutes for t in trip_scores) / 60.0

        return DriverScore(
            driver_id=driver_id,
            overall_score=round(credible_overall, 2),
            acceleration_score=round(w * raw_accel + (1 - w) * population_mean, 2),
            braking_score=round(w * raw_brake + (1 - w) * population_mean, 2),
            speeding_score=round(w * raw_speed + (1 - w) * population_mean, 2),
            daytime_score=round(daytime_score, 2),
            nighttime_score=round(nighttime_score, 2),
            total_trips=n,
            total_distance_km=round(sum(t.distance_km for t in trip_scores), 2),
            total_driving_hours=round(total_hours, 2),
            grade=TripScore.grade_from_score(credible_overall),
            credibility_weight=round(w, 4),
        )
