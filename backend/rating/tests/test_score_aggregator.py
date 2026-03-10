"""
Tests for ScoreAggregator (credibility blending, day/night breakdown).
"""
import pytest
import math
from scoring_engine import TripScorer, ScoreAggregator
from scoring_engine.score_aggregator import FULL_CREDIBILITY_TRIPS, POPULATION_MEAN_SCORE


@pytest.fixture
def scorer():
    return TripScorer()


@pytest.fixture
def aggregator():
    return ScoreAggregator()


class TestEmptyHistory:
    def test_no_trips_returns_population_mean(self, aggregator):
        score = aggregator.aggregate("driver_x", [])
        assert score.overall_score == POPULATION_MEAN_SCORE
        assert score.total_trips == 0
        assert score.credibility_weight == 0.0

    def test_no_trips_grade_c(self, aggregator):
        score = aggregator.aggregate("driver_x", [])
        assert score.grade == "C"


class TestCredibilityWeighting:
    def test_weight_increases_with_trips(self, scorer, aggregator, clean_trip):
        """More trips → higher credibility weight."""
        trips = [clean_trip] * 5
        scores_5 = [scorer.score(t) for t in trips]
        w5 = aggregator.aggregate("x", scores_5).credibility_weight

        trips = [clean_trip] * 20
        scores_20 = [scorer.score(t) for t in trips]
        w20 = aggregator.aggregate("x", scores_20).credibility_weight

        assert w20 > w5

    def test_full_credibility_at_threshold(self, scorer, aggregator, clean_trip):
        """credibility_weight == 1.0 at FULL_CREDIBILITY_TRIPS trips."""
        trips = [clean_trip] * FULL_CREDIBILITY_TRIPS
        trip_scores = [scorer.score(t) for t in trips]
        driver_score = aggregator.aggregate("x", trip_scores)
        assert driver_score.credibility_weight == pytest.approx(1.0)

    def test_credibility_formula(self, scorer, aggregator, clean_trip):
        n = 5
        trips = [clean_trip] * n
        trip_scores = [scorer.score(t) for t in trips]
        driver_score = aggregator.aggregate("x", trip_scores)
        expected_w = math.sqrt(n / FULL_CREDIBILITY_TRIPS)
        assert driver_score.credibility_weight == pytest.approx(expected_w, abs=0.001)

    def test_blending_pulls_towards_mean(self, scorer, aggregator, terrible_trip):
        """
        With only 2 terrible trips (score ≈ 0), credibility is low (~0.32).
        The blended score is pulled UP toward the population mean (72),
        so blended_score > raw_score (≈ 0).
        """
        trip_scores = [scorer.score(terrible_trip), scorer.score(terrible_trip)]
        driver_score = aggregator.aggregate("x", trip_scores)
        raw_score = sum(s.overall_score for s in trip_scores) / 2
        # terrible_trip scores ≈ 0; blended should be pulled UP toward mean
        assert driver_score.overall_score > raw_score
        # And still below the population mean (not over-credited)
        assert driver_score.overall_score < POPULATION_MEAN_SCORE


class TestDayNightBreakdown:
    def test_daytime_trip_recorded(self, scorer, aggregator, clean_trip):
        ts = scorer.score(clean_trip)   # clean_trip uses hour=10 → daytime
        ds = aggregator.aggregate("x", [ts])
        assert ds.daytime_score == pytest.approx(ts.overall_score, abs=0.1)

    def test_nighttime_trip_recorded(self, scorer, aggregator, terrible_trip):
        ts = scorer.score(terrible_trip)   # terrible_trip uses hour=23 → nighttime
        ds = aggregator.aggregate("x", [ts])
        assert ds.nighttime_score == pytest.approx(ts.overall_score, abs=0.1)

    def test_fallback_when_only_daytime(self, scorer, aggregator, clean_trip):
        """If no night trips, nighttime_score falls back to overall credible score."""
        ts = scorer.score(clean_trip)
        ds = aggregator.aggregate("x", [ts])
        # nighttime_score should be the credible overall (no night data to use)
        assert ds.nighttime_score == pytest.approx(ds.overall_score, abs=0.1)


class TestAccumulationStats:
    def test_total_trips_count(self, scorer, aggregator, clean_trip, moderate_trip):
        scores = [scorer.score(clean_trip), scorer.score(moderate_trip)]
        ds = aggregator.aggregate("x", scores)
        assert ds.total_trips == 2

    def test_total_distance(self, scorer, aggregator, clean_trip, moderate_trip):
        scores = [scorer.score(clean_trip), scorer.score(moderate_trip)]
        ds = aggregator.aggregate("x", scores)
        expected = clean_trip.distance_km + moderate_trip.distance_km
        assert ds.total_distance_km == pytest.approx(expected, abs=0.01)
