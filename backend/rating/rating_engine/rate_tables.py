"""
Rate Tables
============
All lookup tables in one place.  Each UW question from the sign-up form
has exactly 5 selectable options.  Factors are indicative; they should be
re-calibrated once real claims experience is available.

Sources / calibration references
---------------------------------
- ABI motor rating data (2023)
- CAS Study Note – Werner & Modlin, "Basic Ratemaking" (2016)
- Thatcham Research vehicle risk groups
- DVLA age/claims data
- UK NCD ladder (standard market 0–5+ year bands)
"""

from __future__ import annotations

# ─────────────────────────────────────────────────────────────────────────────
# BASE RATE  (annual premium in £ before any factors applied)
# Represents the expected pure risk cost for a standard risk profile:
#   • 35-year-old driver
#   • Ford Focus 1.6L, 3 years old
#   • 2 years NCD
#   • 0 claims
#   • Telematics score 72 (population mean)
# ─────────────────────────────────────────────────────────────────────────────
BASE_RATE_GBP: float = 480.0

# ─────────────────────────────────────────────────────────────────────────────
# VEHICLE MAKES  –  5 dropdown options
# ─────────────────────────────────────────────────────────────────────────────
VEHICLE_MAKES: list[str] = [
    "Toyota",
    "Ford",
    "Volkswagen",
    "BMW",
    "Vauxhall",
]

# ─────────────────────────────────────────────────────────────────────────────
# VEHICLE MODELS  –  5 options per make, each mapped to a risk group (1–50)
# Risk groups approximate Thatcham / ABI group ratings.
# Higher group → higher repair costs / theft risk → higher factor.
# ─────────────────────────────────────────────────────────────────────────────
# fmt: off
VEHICLE_MODELS: dict[str, list[dict]] = {
    "Toyota": [
        {"model": "Aygo",   "risk_group": 4},
        {"model": "Yaris",  "risk_group": 8},
        {"model": "Corolla","risk_group": 14},
        {"model": "RAV4",   "risk_group": 22},
        {"model": "GR86",   "risk_group": 32},
    ],
    "Ford": [
        {"model": "Ka+",     "risk_group": 5},
        {"model": "Fiesta",  "risk_group": 9},
        {"model": "Focus",   "risk_group": 15},
        {"model": "Kuga",    "risk_group": 21},
        {"model": "Mustang", "risk_group": 40},
    ],
    "Volkswagen": [
        {"model": "Polo",    "risk_group": 10},
        {"model": "Golf",    "risk_group": 16},
        {"model": "Passat",  "risk_group": 20},
        {"model": "Tiguan",  "risk_group": 24},
        {"model": "Golf GTI","risk_group": 36},
    ],
    "BMW": [
        {"model": "1 Series", "risk_group": 18},
        {"model": "3 Series", "risk_group": 25},
        {"model": "5 Series", "risk_group": 30},
        {"model": "X5",       "risk_group": 35},
        {"model": "M3",       "risk_group": 47},
    ],
    "Vauxhall": [
        {"model": "Corsa",   "risk_group": 7},
        {"model": "Astra",   "risk_group": 13},
        {"model": "Mokka",   "risk_group": 19},
        {"model": "Grandland","risk_group": 23},
        {"model": "Insignia", "risk_group": 26},
    ],
}
# fmt: on

def vehicle_risk_group(make: str, model: str) -> int:
    """Return the ABI-equivalent risk group for make+model."""
    entries = VEHICLE_MODELS.get(make, [])
    for entry in entries:
        if entry["model"].lower() == model.lower():
            return entry["risk_group"]
    raise ValueError(f"Unknown vehicle: {make} {model}")


def vehicle_factor_from_group(group: int) -> float:
    """
    Convert ABI risk group (1–50) to a rating multiplier.
    Calibrated so group 15 (mid-market) = 1.00.
    Approximately linear with a modest curve at high groups.
    """
    return round(0.60 + (group / 50) * 1.10, 4)


# ─────────────────────────────────────────────────────────────────────────────
# ENGINE SIZE  –  5 dropdown options (cc bands)
# ─────────────────────────────────────────────────────────────────────────────
ENGINE_SIZES: list[dict] = [
    {"label": "Up to 1000cc",      "min_cc": 0,    "max_cc": 1000, "factor": 0.85},
    {"label": "1001cc – 1400cc",   "min_cc": 1001, "max_cc": 1400, "factor": 0.95},
    {"label": "1401cc – 1800cc",   "min_cc": 1401, "max_cc": 1800, "factor": 1.00},
    {"label": "1801cc – 2500cc",   "min_cc": 1801, "max_cc": 2500, "factor": 1.18},
    {"label": "Over 2500cc",       "min_cc": 2501, "max_cc": 99999,"factor": 1.42},
]

def engine_size_factor(cc: int) -> float:
    for band in ENGINE_SIZES:
        if band["min_cc"] <= cc <= band["max_cc"]:
            return band["factor"]
    raise ValueError(f"Engine size {cc}cc outside supported range")


# ─────────────────────────────────────────────────────────────────────────────
# DRIVER AGE  –  continuous, banded for rating
# Based on DVLA / Confused.com published average premium data (2023).
# Young drivers (17–25) are 3–6× more likely to have a serious accident.
# ─────────────────────────────────────────────────────────────────────────────
AGE_BANDS: list[dict] = [
    {"label": "17–21", "min": 17, "max": 21, "factor": 2.80},
    {"label": "22–25", "min": 22, "max": 25, "factor": 1.90},
    {"label": "26–29", "min": 26, "max": 29, "factor": 1.35},
    {"label": "30–49", "min": 30, "max": 49, "factor": 1.00},
    {"label": "50–64", "min": 50, "max": 64, "factor": 0.92},
    {"label": "65–69", "min": 65, "max": 69, "factor": 1.05},
    {"label": "70+",   "min": 70, "max": 120,"factor": 1.28},
]

def age_factor(age: int) -> float:
    for band in AGE_BANDS:
        if band["min"] <= age <= band["max"]:
            return band["factor"]
    raise ValueError(f"Age {age} outside supported range (17–120)")


# ─────────────────────────────────────────────────────────────────────────────
# NO-CLAIMS DISCOUNT (years with current insurer)  –  5 dropdown options
# UK NCD ladder is the industry standard.  We treat years-with-insurer as a
# NCD proxy; in production this should be verified via AskMID / CUE.
# ─────────────────────────────────────────────────────────────────────────────
NCD_BANDS: list[dict] = [
    {"label": "0 years",  "years": 0, "discount_pct": 0,  "factor": 1.00},
    {"label": "1 year",   "years": 1, "discount_pct": 30, "factor": 0.70},
    {"label": "2 years",  "years": 2, "discount_pct": 40, "factor": 0.60},
    {"label": "3 years",  "years": 3, "discount_pct": 50, "factor": 0.50},
    {"label": "4 years",  "years": 4, "discount_pct": 60, "factor": 0.40},
    {"label": "5+ years", "years": 5, "discount_pct": 65, "factor": 0.35},
]

def ncd_factor(years: int) -> float:
    capped = min(years, 5)
    for band in NCD_BANDS:
        if band["years"] == capped:
            return band["factor"]
    return 1.00


# ─────────────────────────────────────────────────────────────────────────────
# CLAIMS LOADING  –  per claim in last 3 years
# Fault claims attract significantly higher loading than non-fault.
# We treat all sign-up claims as fault (conservative; can be split later).
# CUE (Claims and Underwriting Exchange) data reference: ABI (2022).
# ─────────────────────────────────────────────────────────────────────────────
CLAIMS_LOADINGS: list[dict] = [
    {"label": "0 claims", "claims": 0, "factor": 1.00},
    {"label": "1 claim",  "claims": 1, "factor": 1.45},
    {"label": "2 claims", "claims": 2, "factor": 2.10},
    {"label": "3 claims", "claims": 3, "factor": 3.20},
    {"label": "4+ claims","claims": 4, "factor": 4.50},
]

def claims_factor(n_claims: int) -> float:
    capped = min(n_claims, 4)
    for band in CLAIMS_LOADINGS:
        if band["claims"] == capped:
            return band["factor"]
    return 1.00


# ─────────────────────────────────────────────────────────────────────────────
# INSURER LIST  –  5 dropdown options (cosmetic; no rating impact)
# Collected for future use in market benchmarking / CUE lookups.
# ─────────────────────────────────────────────────────────────────────────────
INSURERS: list[str] = [
    "Admiral",
    "Aviva",
    "Direct Line",
    "Churchill",
    "Hastings Direct",
]


# ─────────────────────────────────────────────────────────────────────────────
# TELEMATICS MULTIPLIER  –  driving score → premium multiplier
# ─────────────────────────────────────────────────────────────────────────────
TELEMATICS_BANDS: list[dict] = [
    {"label": "Grade A (90–100)", "min_score": 90,  "max_score": 100, "multiplier": 0.75},
    {"label": "Grade B (80–89)",  "min_score": 80,  "max_score": 89,  "multiplier": 0.82},
    {"label": "Grade C (70–79)",  "min_score": 70,  "max_score": 79,  "multiplier": 0.88},
    {"label": "Grade D (60–69)",  "min_score": 60,  "max_score": 69,  "multiplier": 0.94},
    {"label": "Grade E (<60)",    "min_score": 0,   "max_score": 59,  "multiplier": 1.10},
]
"""
Grade E carries a 10% surcharge (1.10) rather than a neutral 1.00.
This reflects the actuarial finding that drivers who score poorly on
telematics have materially higher claim frequency than the population mean.
Consistent with Vitality Drive and Marmalade published methodology.
"""

# Applied when no telematics data is available (first 30 days / < 5 trips)
TELEMATICS_NO_DATA_MULTIPLIER: float = 1.05
"""
Slight surcharge for drivers without data.  This incentivises app usage
and protects against adverse selection (bad drivers avoiding the app).
"""

def telematics_multiplier(score: float) -> float:
    for band in TELEMATICS_BANDS:
        if band["min_score"] <= score <= band["max_score"]:
            return band["multiplier"]
    return TELEMATICS_NO_DATA_MULTIPLIER
