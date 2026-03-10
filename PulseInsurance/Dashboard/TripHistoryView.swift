import SwiftUI

struct TripHistoryView: View {
    @EnvironmentObject var engine: TelematicsEngine
    @State private var selectedTrip: Trip?
    @State private var filterTimeOfDay: Trip.TimeOfDay? = nil

    var filteredTrips: [Trip] {
        guard let filter = filterTimeOfDay else { return engine.trips }
        return engine.trips.filter { $0.timeOfDay == filter }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Filter bar
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        FilterChip(label: "All", isSelected: filterTimeOfDay == nil) {
                            filterTimeOfDay = nil
                        }
                        ForEach(Trip.TimeOfDay.allCases, id: \.self) { tod in
                            FilterChip(
                                label: tod.rawValue,
                                isSelected: filterTimeOfDay == tod
                            ) {
                                filterTimeOfDay = filterTimeOfDay == tod ? nil : tod
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                }

                if filteredTrips.isEmpty {
                    Spacer()
                    VStack(spacing: 12) {
                        Image(systemName: "map")
                            .font(.system(size: 52))
                            .foregroundColor(PulseTheme.primaryBlue.opacity(0.35))
                        Text("No trips recorded")
                            .font(.headline)
                            .foregroundColor(PulseTheme.textPrimary)
                        Text("Start a trip from the Dashboard tab")
                            .font(.subheadline)
                            .foregroundColor(PulseTheme.textSecondary)
                    }
                    Spacer()
                } else {
                    List {
                        ForEach(filteredTrips) { trip in
                            TripRow(trip: trip)
                                .contentShape(Rectangle())
                                .onTapGesture { selectedTrip = trip }
                                .listRowBackground(Color.clear)
                                .listRowSeparator(.hidden)
                                .listRowInsets(EdgeInsets(top: 6, leading: 16, bottom: 6, trailing: 16))
                        }
                    }
                    .listStyle(.plain)
                    .background(PulseTheme.backgroundGray)
                }
            }
            .background(PulseTheme.backgroundGray.ignoresSafeArea())
            .navigationTitle("Trip History")
            .navigationBarTitleDisplayMode(.large)
            .sheet(item: $selectedTrip) { trip in
                TripDetailView(trip: trip)
            }
        }
    }
}

// MARK: - Filter chip
private struct FilterChip: View {
    let label: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(isSelected ? .white : PulseTheme.textPrimary)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? PulseTheme.primaryBlue : PulseTheme.primaryBlue.opacity(0.08))
                .cornerRadius(20)
        }
    }
}

// MARK: - Trip row
private struct TripRow: View {
    let trip: Trip

    var body: some View {
        HStack(spacing: 14) {
            // Score circle
            ZStack {
                Circle()
                    .fill(PulseTheme.scoreColor(for: trip.telematicsScore.overall).opacity(0.15))
                    .frame(width: 52, height: 52)
                Text(String(format: "%.0f", trip.telematicsScore.overall))
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(PulseTheme.scoreColor(for: trip.telematicsScore.overall))
            }

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(trip.startDate, style: .date)
                        .font(.subheadline).fontWeight(.semibold)
                        .foregroundColor(PulseTheme.textPrimary)
                    Spacer()
                    Image(systemName: trip.timeOfDay == .daytime ? "sun.max.fill" : "moon.stars.fill")
                        .foregroundColor(trip.timeOfDay == .daytime ? PulseTheme.warningAmber : PulseTheme.primaryBlue)
                        .font(.caption)
                    Text(trip.timeOfDay.rawValue)
                        .font(.caption)
                        .foregroundColor(PulseTheme.textSecondary)
                }
                HStack(spacing: 12) {
                    Label(String(format: "%.1f km", trip.distanceKm), systemImage: "location")
                    Label(formattedDuration(trip.durationSeconds), systemImage: "clock")
                    Label("\(trip.events.count) events", systemImage: "exclamationmark.circle")
                }
                .font(.caption)
                .foregroundColor(PulseTheme.textSecondary)
            }
        }
        .padding(14)
        .background(PulseTheme.cardWhite)
        .cornerRadius(14)
        .shadow(color: .black.opacity(0.05), radius: 4, y: 1)
    }

    private func formattedDuration(_ secs: Double) -> String {
        let m = Int(secs) / 60
        return m < 60 ? "\(m) min" : String(format: "%.1f hr", secs / 3600)
    }
}

// MARK: - Trip detail sheet
struct TripDetailView: View {
    let trip: Trip
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Score header
                    HStack(spacing: 20) {
                        ZStack {
                            Circle()
                                .stroke(PulseTheme.scoreColor(for: trip.telematicsScore.overall).opacity(0.2), lineWidth: 6)
                                .frame(width: 72, height: 72)
                            Circle()
                                .trim(from: 0, to: trip.telematicsScore.overall / 100)
                                .stroke(PulseTheme.scoreColor(for: trip.telematicsScore.overall),
                                        style: StrokeStyle(lineWidth: 6, lineCap: .round))
                                .rotationEffect(.degrees(-90))
                                .frame(width: 72, height: 72)
                            Text(String(format: "%.0f", trip.telematicsScore.overall))
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(PulseTheme.scoreColor(for: trip.telematicsScore.overall))
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text(trip.startDate, style: .date)
                                .font(.title3).fontWeight(.bold).foregroundColor(PulseTheme.textPrimary)
                            HStack {
                                Image(systemName: trip.timeOfDay == .daytime ? "sun.max.fill" : "moon.stars.fill")
                                Text(trip.timeOfDay.rawValue)
                            }
                            .font(.subheadline)
                            .foregroundColor(trip.timeOfDay == .daytime ? PulseTheme.warningAmber : PulseTheme.primaryBlue)
                            Text("Grade: \(trip.telematicsScore.grade.rawValue)")
                                .font(.subheadline)
                                .foregroundColor(PulseTheme.scoreColor(for: trip.telematicsScore.overall))
                        }
                        Spacer()
                    }
                    .padding(16).pulseCard()

                    // Trip stats
                    HStack(spacing: 0) {
                        TripDetailStat(label: "Distance", value: String(format: "%.1f km", trip.distanceKm))
                        Divider().frame(height: 40)
                        TripDetailStat(label: "Duration", value: formattedDuration(trip.durationSeconds))
                        Divider().frame(height: 40)
                        TripDetailStat(label: "Events", value: "\(trip.events.count)")
                    }
                    .padding(16).pulseCard()

                    // Category scores
                    VStack(spacing: 12) {
                        DetailScoreRow(label: "Acceleration", score: trip.telematicsScore.accelerationScore, icon: "arrow.up.circle.fill")
                        DetailScoreRow(label: "Braking", score: trip.telematicsScore.brakingScore, icon: "arrow.down.circle.fill")
                        DetailScoreRow(label: "Speed Management", score: trip.telematicsScore.speedingScore, icon: "gauge.high")
                    }
                    .padding(16).pulseCard()

                    // Events list
                    if !trip.events.isEmpty {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Driving Events (\(trip.events.count))")
                                .font(.headline).foregroundColor(PulseTheme.textPrimary)
                            ForEach(trip.events) { event in
                                EventRow(event: event)
                            }
                        }
                        .padding(16).pulseCard()
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 24)
            }
            .background(PulseTheme.backgroundGray.ignoresSafeArea())
            .navigationTitle("Trip Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Close") { dismiss() }
                }
            }
        }
    }

    private func formattedDuration(_ secs: Double) -> String {
        let m = Int(secs) / 60
        return m < 60 ? "\(m) min" : String(format: "%.1f hr", secs / 3600)
    }
}

private struct TripDetailStat: View {
    let label: String
    let value: String
    var body: some View {
        VStack(spacing: 4) {
            Text(value).font(.system(size: 15, weight: .bold)).foregroundColor(PulseTheme.textPrimary)
            Text(label).font(.caption2).foregroundColor(PulseTheme.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }
}

private struct DetailScoreRow: View {
    let label: String
    let score: Double
    let icon: String
    var body: some View {
        HStack {
            Image(systemName: icon).foregroundColor(PulseTheme.primaryBlue).frame(width: 22)
            Text(label).font(.subheadline).foregroundColor(PulseTheme.textPrimary)
            Spacer()
            Text(String(format: "%.0f", score))
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(PulseTheme.scoreColor(for: score))
        }
    }
}

private struct EventRow: View {
    let event: DrivingEvent
    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: eventIcon)
                .foregroundColor(severityColor)
                .frame(width: 20)
            VStack(alignment: .leading, spacing: 2) {
                Text(event.type.rawValue).font(.subheadline).foregroundColor(PulseTheme.textPrimary)
                Text(event.timestamp, style: .time).font(.caption).foregroundColor(PulseTheme.textSecondary)
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 2) {
                Text(String(format: "%.0f km/h", event.speedKmh)).font(.caption).foregroundColor(PulseTheme.textSecondary)
                Text(event.severity.rawValue).font(.caption).fontWeight(.medium).foregroundColor(severityColor)
            }
        }
        .padding(10)
        .background(severityColor.opacity(0.06))
        .cornerRadius(8)
    }

    private var eventIcon: String {
        switch event.type {
        case .hardAcceleration, .mildAcceleration: return "arrow.up.circle.fill"
        case .hardBraking, .mildBraking: return "arrow.down.circle.fill"
        case .speeding: return "gauge.badge.plus"
        }
    }

    private var severityColor: Color {
        switch event.severity {
        case .low:    return PulseTheme.successGreen
        case .medium: return PulseTheme.warningAmber
        case .high:   return PulseTheme.dangerRed
        }
    }
}
