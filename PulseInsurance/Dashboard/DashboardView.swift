import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var engine: TelematicsEngine
    @State private var elapsedSeconds: Int = 0
    @State private var timer: Timer?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {

                    // Live trip card
                    LiveTripCard(
                        engine: engine,
                        elapsed: elapsedSeconds,
                        onStartStop: handleStartStop
                    )

                    if engine.isTracking {
                        // Real-time metrics row
                        HStack(spacing: 14) {
                            LiveMetricTile(
                                icon: "speedometer",
                                label: "Speed",
                                value: String(format: "%.0f", engine.currentTrip.speedKmh),
                                unit: "km/h",
                                color: speedColor
                            )
                            LiveMetricTile(
                                icon: "arrow.up.circle.fill",
                                label: "Acceleration",
                                value: String(format: "%.2f", engine.currentTrip.currentAcceleration),
                                unit: "g",
                                color: accelColor
                            )
                            LiveMetricTile(
                                icon: "location.circle.fill",
                                label: "Distance",
                                value: String(format: "%.1f", engine.currentTrip.distanceKm),
                                unit: "km",
                                color: PulseTheme.primaryBlue
                            )
                        }

                        // Time-of-day badge
                        TimeOfDayBadge(timeOfDay: engine.currentTrip.timeOfDay)

                        // Recent events
                        if !engine.currentTrip.recentEvents.isEmpty {
                            RecentEventsCard(events: engine.currentTrip.recentEvents)
                        }
                    } else {
                        // Score summary when idle
                        if engine.driverScore.totalTrips > 0 {
                            QuickScoreSummary(score: engine.driverScore)
                        }

                        // Last trip card
                        if let lastTrip = engine.trips.first {
                            LastTripCard(trip: lastTrip)
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 24)
            }
            .background(PulseTheme.backgroundGray.ignoresSafeArea())
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.large)
        }
        .onChange(of: engine.isTracking) { _, tracking in
            if tracking { startTimer() } else { stopTimer() }
        }
    }

    // MARK: - Helpers

    private func handleStartStop() {
        if engine.isTracking {
            engine.stopTrip()
        } else {
            elapsedSeconds = 0
            engine.startTrip()
        }
    }

    private func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
            elapsedSeconds += 1
        }
    }

    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }

    private var speedColor: Color {
        engine.currentTrip.speedKmh > 100 ? PulseTheme.dangerRed
        : engine.currentTrip.speedKmh > 70 ? PulseTheme.warningAmber
        : PulseTheme.successGreen
    }

    private var accelColor: Color {
        let a = abs(engine.currentTrip.currentAcceleration)
        return a > 0.30 ? PulseTheme.dangerRed
        : a > 0.15 ? PulseTheme.warningAmber
        : PulseTheme.successGreen
    }
}

// MARK: - Live trip card
private struct LiveTripCard: View {
    let engine: TelematicsEngine
    let elapsed: Int
    let onStartStop: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(engine.isTracking ? "Trip in progress" : "Ready to drive?")
                        .font(.headline)
                        .foregroundColor(PulseTheme.textPrimary)
                    if engine.isTracking {
                        Text(formattedElapsed)
                            .font(.system(size: 28, weight: .bold, design: .monospaced))
                            .foregroundColor(PulseTheme.primaryBlue)
                    } else {
                        Text("Tap Start to begin recording")
                            .font(.subheadline)
                            .foregroundColor(PulseTheme.textSecondary)
                    }
                }
                Spacer()
                Button(action: onStartStop) {
                    HStack(spacing: 6) {
                        Image(systemName: engine.isTracking ? "stop.fill" : "play.fill")
                        Text(engine.isTracking ? "Stop" : "Start")
                            .fontWeight(.semibold)
                    }
                    .padding(.horizontal, 18)
                    .padding(.vertical, 12)
                    .background(engine.isTracking ? PulseTheme.dangerRed : PulseTheme.successGreen)
                    .foregroundColor(.white)
                    .cornerRadius(12)
                }
            }

            if engine.isTracking {
                // Event counters
                HStack(spacing: 0) {
                    EventCounter(
                        icon: "arrow.up.circle",
                        label: "Hard Accel",
                        count: engine.currentTrip.hardAccelerations,
                        color: PulseTheme.warningAmber
                    )
                    Divider().frame(height: 36)
                    EventCounter(
                        icon: "arrow.down.circle",
                        label: "Hard Brake",
                        count: engine.currentTrip.hardBrakingEvents,
                        color: PulseTheme.dangerRed
                    )
                    Divider().frame(height: 36)
                    EventCounter(
                        icon: "gauge.badge.plus",
                        label: "Speeding",
                        count: engine.currentTrip.speedingEvents,
                        color: PulseTheme.dangerRed
                    )
                }
            }
        }
        .padding(20)
        .pulseCard()
    }

    private var formattedElapsed: String {
        let h = elapsed / 3600
        let m = (elapsed % 3600) / 60
        let s = elapsed % 60
        return h > 0
            ? String(format: "%d:%02d:%02d", h, m, s)
            : String(format: "%02d:%02d", m, s)
    }
}

private struct EventCounter: View {
    let icon: String
    let label: String
    let count: Int
    let color: Color

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon).foregroundColor(color)
            VStack(alignment: .leading, spacing: 2) {
                Text("\(count)").font(.system(size: 16, weight: .bold)).foregroundColor(PulseTheme.textPrimary)
                Text(label).font(.caption2).foregroundColor(PulseTheme.textSecondary)
            }
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Live metric tile
private struct LiveMetricTile: View {
    let icon: String
    let label: String
    let value: String
    let unit: String
    let color: Color

    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 22))
                .foregroundColor(color)
            Text(value)
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(PulseTheme.textPrimary)
            Text(unit)
                .font(.caption)
                .foregroundColor(PulseTheme.textSecondary)
            Text(label)
                .font(.caption2)
                .foregroundColor(PulseTheme.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(14)
        .pulseCard()
    }
}

// MARK: - Time-of-day badge
private struct TimeOfDayBadge: View {
    let timeOfDay: Trip.TimeOfDay

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: timeOfDay == .daytime ? "sun.max.fill" : "moon.stars.fill")
                .foregroundColor(timeOfDay == .daytime ? PulseTheme.warningAmber : PulseTheme.primaryBlue)
            Text("\(timeOfDay.rawValue) driving")
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(PulseTheme.textPrimary)
            Spacer()
            Text(timeOfDay == .nighttime ? "Drive carefully" : "Good conditions")
                .font(.caption)
                .foregroundColor(PulseTheme.textSecondary)
        }
        .padding(14)
        .pulseCard()
    }
}

// MARK: - Recent events
private struct RecentEventsCard: View {
    let events: [DrivingEvent]

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Recent Events")
                .font(.headline)
                .foregroundColor(PulseTheme.textPrimary)

            ForEach(events) { event in
                HStack(spacing: 10) {
                    Circle()
                        .fill(severityColor(event.severity))
                        .frame(width: 8, height: 8)
                    Text(event.type.rawValue)
                        .font(.subheadline)
                        .foregroundColor(PulseTheme.textPrimary)
                    Spacer()
                    Text(String(format: "%.0f km/h", event.speedKmh))
                        .font(.caption)
                        .foregroundColor(PulseTheme.textSecondary)
                    Text(event.severity.rawValue)
                        .font(.caption)
                        .foregroundColor(severityColor(event.severity))
                }
            }
        }
        .padding(16)
        .pulseCard()
    }

    private func severityColor(_ severity: DrivingEvent.Severity) -> Color {
        switch severity {
        case .low:    return PulseTheme.successGreen
        case .medium: return PulseTheme.warningAmber
        case .high:   return PulseTheme.dangerRed
        }
    }
}

// MARK: - Quick score summary (idle state)
private struct QuickScoreSummary: View {
    let score: DriverScore

    var body: some View {
        HStack(spacing: 20) {
            // Grade circle
            ZStack {
                Circle()
                    .stroke(PulseTheme.scoreColor(for: score.overallScore).opacity(0.2), lineWidth: 8)
                    .frame(width: 72, height: 72)
                Circle()
                    .trim(from: 0, to: score.overallScore / 100)
                    .stroke(PulseTheme.scoreColor(for: score.overallScore), style: StrokeStyle(lineWidth: 8, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                    .frame(width: 72, height: 72)
                Text(score.grade)
                    .font(.system(size: 26, weight: .bold))
                    .foregroundColor(PulseTheme.scoreColor(for: score.overallScore))
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("Your Score")
                    .font(.caption)
                    .foregroundColor(PulseTheme.textSecondary)
                Text(String(format: "%.0f / 100", score.overallScore))
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(PulseTheme.textPrimary)
                Text(String(format: "%.0f%% potential discount", score.discountPercentage))
                    .font(.subheadline)
                    .foregroundColor(PulseTheme.successGreen)
            }
            Spacer()
        }
        .padding(16)
        .pulseCard()
    }
}

// MARK: - Last trip card
private struct LastTripCard: View {
    let trip: Trip

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Last Trip")
                    .font(.headline)
                    .foregroundColor(PulseTheme.textPrimary)
                Spacer()
                Text(trip.startDate, style: .date)
                    .font(.caption)
                    .foregroundColor(PulseTheme.textSecondary)
            }

            HStack(spacing: 0) {
                TripStat(label: "Score", value: String(format: "%.0f", trip.telematicsScore.overall))
                TripStat(label: "Distance", value: String(format: "%.1f km", trip.distanceKm))
                TripStat(label: "Time", value: formattedDuration(trip.durationSeconds))
                TripStat(label: "Period", value: trip.timeOfDay.rawValue)
            }
        }
        .padding(16)
        .pulseCard()
    }

    private func formattedDuration(_ secs: Double) -> String {
        let m = Int(secs) / 60
        return m < 60 ? "\(m) min" : String(format: "%.1f hr", secs / 3600)
    }
}

private struct TripStat: View {
    let label: String
    let value: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(PulseTheme.textPrimary)
            Text(label)
                .font(.caption2)
                .foregroundColor(PulseTheme.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }
}
