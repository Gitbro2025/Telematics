# Pulse Insurance – iOS Telematics App

A native iOS telematics application for **Pulse Insurance** that monitors driver behaviour to calculate personalised insurance premiums.

---

## Features

### Telematics Monitoring
| Metric | How it's measured |
|---|---|
| **Acceleration** | CoreMotion longitudinal g-force (threshold: mild ≥0.15g, hard ≥0.30g) |
| **Braking** | CoreMotion longitudinal g-force (threshold: mild ≤−0.20g, hard ≤−0.35g) |
| **Speed Management** | CLLocationManager speed vs. posted speed limit (+5 km/h buffer) |
| **Daytime / Night-time** | Trip start time classified as Daytime (07:00–21:00) or Night-time |

### Driver Score (0–100)
- Acceleration: 35%
- Braking: 35%
- Speed Management: 30%
- Separate day / night breakdown
- Up to **25% premium discount** for high scores

### Sign-Up Wizard (5 steps)
1. Email + password
2. First name, last name, phone number
3. Home address (line 1/2, city, county, postcode)
4. Vehicle make, model, year, registration, engine size
5. Current insurer, years with insurer, claims in last 3 years

---

## Project Structure

```
PulseInsurance/
├── App/
│   ├── PulseInsuranceApp.swift   # @main entry point
│   ├── RootView.swift            # Auth gate
│   ├── MainTabView.swift         # Tab bar
│   └── PulseTheme.swift          # Design system (colours, button styles)
│
├── Authentication/
│   ├── AuthViewModel.swift
│   ├── WelcomeView.swift
│   ├── SignInView.swift
│   ├── SignUpContainerView.swift  # Multi-step wizard + progress bar
│   └── SignUpStepViews.swift      # Steps 1–5 + shared UI components
│
├── Telematics/
│   └── TelematicsEngine.swift    # Core engine: event detection, scoring
│
├── Dashboard/
│   ├── DashboardView.swift       # Live trip card + real-time metrics
│   ├── ScoreView.swift           # Score breakdown + discount banner
│   ├── TripHistoryView.swift     # Trip list + detail sheet
│   └── ProfileView.swift         # User profile + sign out
│
├── Models/
│   ├── User.swift
│   ├── Trip.swift                # Trip, DrivingEvent, RoutePoint
│   └── DriverScore.swift
│
├── Services/
│   ├── AuthService.swift         # Session management (swap for Firebase)
│   ├── LocationService.swift     # CLLocationManager wrapper
│   ├── MotionService.swift       # CMMotionManager wrapper (100 Hz)
│   └── TripStorageService.swift  # UserDefaults persistence
│
└── Resources/
    └── Info.plist                # Permissions + background modes
```

---

## Getting Started

### Requirements
- Xcode 15+
- iOS 16.0+ device (simulator won't produce real motion data)
- Apple Developer account (for Always-On Location entitlement)

### Build with XcodeGen (recommended)
```bash
brew install xcodegen
cd PulseInsurance
xcodegen generate
open PulseInsurance.xcodeproj
```

### Manual Xcode setup
1. Create a new **iOS App** project in Xcode (SwiftUI, Swift)
2. Delete the default `ContentView.swift`
3. Drag all folders (`App/`, `Authentication/`, etc.) into the project navigator
4. Set `Info.plist` to `PulseInsurance/Resources/Info.plist`
5. Add the **Background Modes** capability: ✅ Location updates
6. Set your Team ID in Signing & Capabilities

---

## Backend Integration

The app uses a mock `AuthService` that stores data in `UserDefaults`. To connect a real backend:

| File | Replace with |
|---|---|
| `AuthService.signIn()` | Firebase Auth / custom JWT endpoint |
| `AuthService.register()` | REST API call to create user record |
| `TripStorageService` | CloudKit / Firestore trip sync |
| `LocationService.speedLimitKmh` | Apple Maps speed limit API or HERE Maps |

---

## Permissions Required

```
NSLocationAlwaysAndWhenInUseUsageDescription  – background speed tracking
NSMotionUsageDescription                      – accelerometer / gyroscope
UIBackgroundModes: location                   – continuous trip monitoring
```

---

## Scoring Algorithm

```
Score = Accel(35%) + Braking(35%) + Speed(30%)

Each category starts at 100 and loses points per event:
  Low severity    → −1 pt
  Medium severity → −3 pts
  Hard severity   → −6 pts

Penalties normalised per 10 minutes driven (fairer for longer trips).
```

---

## Discount Table

| Score | Grade | Premium Discount |
|---|---|---|
| 90–100 | A | 25% |
| 80–89  | B | 18% |
| 70–79  | C | 12% |
| 60–69  | D | 6%  |
| <60    | E | 0%  |

---

*Built for Pulse Insurance · iOS 16+ · SwiftUI + CoreMotion + CoreLocation*
