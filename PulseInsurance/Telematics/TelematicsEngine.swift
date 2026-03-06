import Foundation
import CoreLocation
import Combine

// MARK: - Thresholds (tuneable)
private enum Threshold {
    // Acceleration (g-force, positive = forward)
    static let mildAccel: Double  = 0.15
    static let hardAccel: Double  = 0.30

    // Braking (g-force, negative = deceleration)
    static let mildBrake: Double  = -0.20
    static let hardBrake: Double  = -0.35

    // Speeding tolerance above posted limit (km/h)
    static let speedingBuffer: Double = 5.0

    // Minimum speed to consider the device is in a moving vehicle (km/h)
    static let movingThreshold: Double = 5.0
}

@MainActor
final class TelematicsEngine: ObservableObject {

    // MARK: - Published state
    @Published var isTracking: Bool = false
    @Published var currentTrip: ActiveTripState = .init()
    @Published var trips: [Trip] = []
    @Published var driverScore: DriverScore = .empty

    // MARK: - Private services
    private let locationService = LocationService()
    private let motionService   = MotionService()
    private var cancellables    = Set<AnyCancellable>()

    // Temp storage during a trip
    private var activeEvents: [DrivingEvent] = []
    private var routePoints: [Trip.RoutePoint] = []
    private var tripStart: Date?
    private var lastEventTime: Date = .distantPast
    private let eventCooldown: TimeInterval = 2.0  // seconds between same-type events

    init() {
        trips = TripStorageService.shared.load()
        computeDriverScore()
        bindServices()
    }

    // MARK: - Public API

    func requestPermissions() {
        locationService.requestPermission()
    }

    func startTrip() {
        guard !isTracking else { return }
        isTracking = true
        activeEvents = []
        routePoints  = []
        tripStart    = Date()
        currentTrip  = ActiveTripState()
        locationService.startTracking()
        motionService.start()
    }

    func stopTrip() {
        guard isTracking, let start = tripStart else { return }
        isTracking = false
        locationService.stopTracking()
        motionService.stop()

        let duration = Date().timeIntervalSince(start)
        let distanceKm = routePoints.reduce(0.0) { sum, _ in sum } // simplified; use CLLocation for real distance

        let score = TelematicsEngine.calculateScore(events: activeEvents, durationSecs: duration)
        let trip = Trip(
            id: UUID().uuidString,
            startDate: start,
            endDate: Date(),
            distanceKm: max(currentTrip.distanceKm, 0.1),
            durationSeconds: duration,
            timeOfDay: Trip.TimeOfDay.classify(for: start),
            telematicsScore: score,
            events: activeEvents,
            routePoints: routePoints
        )
        trips.insert(trip, at: 0)
        TripStorageService.shared.append(trip)
        computeDriverScore()
        currentTrip = .init()
    }

    // MARK: - Binding data streams

    private func bindServices() {
        // Location updates
        locationService.$currentLocation
            .compactMap { $0 }
            .receive(on: RunLoop.main)
            .sink { [weak self] location in
                self?.handleLocationUpdate(location)
            }
            .store(in: &cancellables)

        locationService.$currentSpeedKmh
            .receive(on: RunLoop.main)
            .sink { [weak self] speed in
                self?.currentTrip.speedKmh = speed
            }
            .store(in: &cancellables)

        // Motion updates (acceleration / braking detection)
        motionService.$longitudinalAcceleration
            .receive(on: RunLoop.main)
            .sink { [weak self] accel in
                self?.handleAcceleration(accel)
            }
            .store(in: &cancellables)
    }

    // MARK: - Location handling

    private var lastLocation: CLLocation?

    private func handleLocationUpdate(_ location: CLLocation) {
        guard isTracking else { return }

        let speedKmh = location.speed > 0 ? location.speed * 3.6 : 0
        currentTrip.speedKmh = speedKmh

        // Accumulate distance
        if let last = lastLocation {
            let delta = location.distance(from: last) / 1000.0  // km
            currentTrip.distanceKm += delta
        }
        lastLocation = location

        // Route point
        routePoints.append(Trip.RoutePoint(
            latitude: location.coordinate.latitude,
            longitude: location.coordinate.longitude,
            timestamp: Date(),
            speedKmh: speedKmh
        ))

        // Speed zone check
        if let limit = locationService.speedLimitKmh {
            let overspeed = speedKmh - (limit + Threshold.speedingBuffer)
            if overspeed > 0 && isTracking {
                let severity: DrivingEvent.Severity = overspeed > 20 ? .high : overspeed > 10 ? .medium : .low
                recordEvent(type: .speeding, severity: severity, location: location, speed: speedKmh)
                currentTrip.speedingEvents += 1
            }
        }

        // Daytime tracking
        currentTrip.timeOfDay = Trip.TimeOfDay.classify(for: Date())
    }

    // MARK: - Acceleration / braking detection

    private func handleAcceleration(_ accel: Double) {
        guard isTracking,
              currentTrip.speedKmh > Threshold.movingThreshold,
              let loc = locationService.currentLocation
        else { return }

        currentTrip.currentAcceleration = accel

        if accel >= Threshold.hardAccel {
            recordEvent(type: .hardAcceleration, severity: .high, location: loc, speed: currentTrip.speedKmh)
            currentTrip.hardAccelerations += 1
        } else if accel >= Threshold.mildAccel {
            recordEvent(type: .mildAcceleration, severity: .low, location: loc, speed: currentTrip.speedKmh)
        } else if accel <= Threshold.hardBrake {
            recordEvent(type: .hardBraking, severity: .high, location: loc, speed: currentTrip.speedKmh)
            currentTrip.hardBrakingEvents += 1
        } else if accel <= Threshold.mildBrake {
            recordEvent(type: .mildBraking, severity: .low, location: loc, speed: currentTrip.speedKmh)
        }
    }

    private func recordEvent(
        type: DrivingEvent.EventType,
        severity: DrivingEvent.Severity,
        location: CLLocation,
        speed: Double
    ) {
        let now = Date()
        guard now.timeIntervalSince(lastEventTime) > eventCooldown else { return }
        lastEventTime = now

        let event = DrivingEvent(
            id: UUID().uuidString,
            type: type,
            severity: severity,
            timestamp: now,
            speedKmh: speed,
            latitude: location.coordinate.latitude,
            longitude: location.coordinate.longitude
        )
        activeEvents.append(event)
        currentTrip.recentEvents.insert(event, at: 0)
        if currentTrip.recentEvents.count > 5 { currentTrip.recentEvents.removeLast() }
    }

    // MARK: - Score calculation

    static func calculateScore(events: [DrivingEvent], durationSecs: Double) -> Trip.TelematicsScore {
        guard durationSecs > 0 else {
            return Trip.TelematicsScore(
                overall: 100, accelerationScore: 100,
                brakingScore: 100, speedingScore: 100,
                grade: .excellent
            )
        }

        let drivingMinutes = max(durationSecs / 60.0, 1.0)

        // Penalty per event scaled per minute driven
        let accelPenalty  = events.filter { $0.type == .hardAcceleration || $0.type == .mildAcceleration }
            .map(\.severity.penaltyPoints).reduce(0, +)
        let brakePenalty  = events.filter { $0.type == .hardBraking || $0.type == .mildBraking }
            .map(\.severity.penaltyPoints).reduce(0, +)
        let speedPenalty  = events.filter { $0.type == .speeding }
            .map(\.severity.penaltyPoints).reduce(0, +)

        let normFactor = 10.0 / drivingMinutes    // more lenient on longer trips
        let accelScore  = max(0, 100 - accelPenalty * normFactor)
        let brakeScore  = max(0, 100 - brakePenalty * normFactor)
        let speedScore  = max(0, 100 - speedPenalty * normFactor)
        let overall     = (accelScore * 0.35 + brakeScore * 0.35 + speedScore * 0.30)

        return Trip.TelematicsScore(
            overall: overall,
            accelerationScore: accelScore,
            brakingScore: brakeScore,
            speedingScore: speedScore,
            grade: .from(score: overall)
        )
    }

    // MARK: - Driver score aggregation

    private func computeDriverScore() {
        guard !trips.isEmpty else {
            driverScore = .empty
            return
        }
        let n = Double(trips.count)
        let avgOverall = trips.map(\.telematicsScore.overall).reduce(0, +) / n
        let avgAccel   = trips.map(\.telematicsScore.accelerationScore).reduce(0, +) / n
        let avgBrake   = trips.map(\.telematicsScore.brakingScore).reduce(0, +) / n
        let avgSpeed   = trips.map(\.telematicsScore.speedingScore).reduce(0, +) / n

        let dayTrips   = trips.filter { $0.timeOfDay == .daytime }
        let nightTrips = trips.filter { $0.timeOfDay == .nighttime }

        let dayScore   = dayTrips.isEmpty   ? avgOverall
                         : dayTrips.map(\.telematicsScore.overall).reduce(0, +) / Double(dayTrips.count)
        let nightScore = nightTrips.isEmpty ? avgOverall
                         : nightTrips.map(\.telematicsScore.overall).reduce(0, +) / Double(nightTrips.count)

        let totalDist  = trips.map(\.distanceKm).reduce(0, +)
        let totalHours = trips.map(\.durationSeconds).reduce(0, +) / 3600.0

        driverScore = DriverScore(
            userId: "",
            overallScore: avgOverall,
            accelerationScore: avgAccel,
            brakingScore: avgBrake,
            speedingScore: avgSpeed,
            daytimeScore: dayScore,
            nighttimeScore: nightScore,
            totalTrips: trips.count,
            totalDistanceKm: totalDist,
            totalDrivingHours: totalHours,
            lastUpdated: Date()
        )
    }
}

// MARK: - Live trip state (transient, not persisted)
struct ActiveTripState {
    var speedKmh: Double = 0
    var currentAcceleration: Double = 0
    var distanceKm: Double = 0
    var hardAccelerations: Int = 0
    var hardBrakingEvents: Int = 0
    var speedingEvents: Int = 0
    var timeOfDay: Trip.TimeOfDay = .daytime
    var recentEvents: [DrivingEvent] = []

    var durationString: String {
        // Formatted elsewhere using timer
        return ""
    }
}
