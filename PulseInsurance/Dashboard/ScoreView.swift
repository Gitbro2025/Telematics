import SwiftUI

struct ScoreView: View {
    @EnvironmentObject var engine: TelematicsEngine

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    if engine.driverScore.totalTrips == 0 {
                        EmptyScoreView()
                    } else {
                        OverallScoreHeader(score: engine.driverScore)
                        CategoryScoresGrid(score: engine.driverScore)
                        TimeOfDayBreakdown(score: engine.driverScore)
                        TripStatsSummary(score: engine.driverScore)
                        DiscountBanner(discount: engine.driverScore.discountPercentage)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 24)
            }
            .background(PulseTheme.backgroundGray.ignoresSafeArea())
            .navigationTitle("Your Score")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

// MARK: - Overall score header
private struct OverallScoreHeader: View {
    let score: DriverScore

    var body: some View {
        VStack(spacing: 16) {
            ZStack {
                // Background arc
                Circle()
                    .trim(from: 0.15, to: 0.85)
                    .stroke(PulseTheme.scoreColor(for: score.overallScore).opacity(0.15),
                            style: StrokeStyle(lineWidth: 18, lineCap: .round))
                    .rotationEffect(.degrees(90))
                    .frame(width: 160, height: 160)

                // Score arc
                Circle()
                    .trim(from: 0.15, to: 0.15 + 0.70 * (score.overallScore / 100))
                    .stroke(PulseTheme.scoreColor(for: score.overallScore),
                            style: StrokeStyle(lineWidth: 18, lineCap: .round))
                    .rotationEffect(.degrees(90))
                    .frame(width: 160, height: 160)
                    .animation(.easeOut(duration: 1.0), value: score.overallScore)

                VStack(spacing: 2) {
                    Text(String(format: "%.0f", score.overallScore))
                        .font(.system(size: 44, weight: .bold))
                        .foregroundColor(PulseTheme.textPrimary)
                    Text("out of 100")
                        .font(.caption)
                        .foregroundColor(PulseTheme.textSecondary)
                }
            }

            VStack(spacing: 4) {
                Text("Grade \(score.grade)")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(PulseTheme.scoreColor(for: score.overallScore))
                Text(gradeDescription)
                    .font(.subheadline)
                    .foregroundColor(PulseTheme.textSecondary)
                    .multilineTextAlignment(.center)
            }
        }
        .padding(24)
        .pulseCard()
    }

    private var gradeDescription: String {
        switch score.overallScore {
        case 90...100: return "Excellent driver – you're eligible for our best rates!"
        case 80..<90:  return "Great driving habits. Keep it up!"
        case 70..<80:  return "Good driver. A few more smooth trips could improve your score."
        case 60..<70:  return "Room to improve. Focus on smooth acceleration and braking."
        default:       return "Your driving needs attention. Smoother habits = lower premium."
        }
    }
}

// MARK: - Category scores
private struct CategoryScoresGrid: View {
    let score: DriverScore

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Category Breakdown")
                .font(.headline)
                .foregroundColor(PulseTheme.textPrimary)

            VStack(spacing: 12) {
                ScoreBar(
                    icon: "arrow.up.circle.fill",
                    label: "Acceleration",
                    score: score.accelerationScore,
                    color: PulseTheme.accentOrange
                )
                ScoreBar(
                    icon: "arrow.down.circle.fill",
                    label: "Braking",
                    score: score.brakingScore,
                    color: PulseTheme.primaryBlue
                )
                ScoreBar(
                    icon: "gauge.high",
                    label: "Speed Management",
                    score: score.speedingScore,
                    color: PulseTheme.successGreen
                )
            }
        }
        .padding(16)
        .pulseCard()
    }
}

private struct ScoreBar: View {
    let icon: String
    let label: String
    let score: Double
    let color: Color

    var body: some View {
        VStack(spacing: 6) {
            HStack {
                Image(systemName: icon).foregroundColor(color).frame(width: 20)
                Text(label)
                    .font(.subheadline)
                    .foregroundColor(PulseTheme.textPrimary)
                Spacer()
                Text(String(format: "%.0f", score))
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(PulseTheme.scoreColor(for: score))
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(color.opacity(0.12)).frame(height: 8)
                    Capsule().fill(color)
                        .frame(width: geo.size.width * (score / 100), height: 8)
                        .animation(.easeOut(duration: 0.8), value: score)
                }
            }
            .frame(height: 8)
        }
    }
}

// MARK: - Time of day breakdown
private struct TimeOfDayBreakdown: View {
    let score: DriverScore

    var body: some View {
        HStack(spacing: 14) {
            TimeOfDayCard(
                icon: "sun.max.fill",
                label: "Daytime",
                score: score.daytimeScore,
                color: PulseTheme.warningAmber
            )
            TimeOfDayCard(
                icon: "moon.stars.fill",
                label: "Night-time",
                score: score.nighttimeScore,
                color: PulseTheme.primaryBlue
            )
        }
    }
}

private struct TimeOfDayCard: View {
    let icon: String
    let label: String
    let score: Double
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 28))
                .foregroundColor(color)
            Text(label)
                .font(.caption)
                .foregroundColor(PulseTheme.textSecondary)
            Text(String(format: "%.0f", score))
                .font(.system(size: 26, weight: .bold))
                .foregroundColor(PulseTheme.scoreColor(for: score))
        }
        .frame(maxWidth: .infinity)
        .padding(16)
        .pulseCard()
    }
}

// MARK: - Trip stats summary
private struct TripStatsSummary: View {
    let score: DriverScore

    var body: some View {
        HStack(spacing: 0) {
            StatCell(value: "\(score.totalTrips)", label: "Total Trips")
            Divider().frame(height: 40)
            StatCell(value: String(format: "%.0f km", score.totalDistanceKm), label: "Total Distance")
            Divider().frame(height: 40)
            StatCell(value: String(format: "%.1f hrs", score.totalDrivingHours), label: "Time Driven")
        }
        .padding(16)
        .pulseCard()
    }
}

private struct StatCell: View {
    let value: String
    let label: String
    var body: some View {
        VStack(spacing: 4) {
            Text(value).font(.system(size: 16, weight: .bold)).foregroundColor(PulseTheme.textPrimary)
            Text(label).font(.caption2).foregroundColor(PulseTheme.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Discount banner
private struct DiscountBanner: View {
    let discount: Double

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: "tag.fill")
                .font(.system(size: 28))
                .foregroundColor(.white)

            VStack(alignment: .leading, spacing: 4) {
                Text("Your potential discount")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.85))
                Text(String(format: "%.0f%% off your premium", discount))
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
            }
            Spacer()
        }
        .padding(20)
        .background(
            LinearGradient(colors: [PulseTheme.successGreen, PulseTheme.successGreen.opacity(0.75)],
                           startPoint: .leading, endPoint: .trailing)
        )
        .cornerRadius(16)
    }
}

// MARK: - Empty state
private struct EmptyScoreView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "car.circle")
                .font(.system(size: 64))
                .foregroundColor(PulseTheme.primaryBlue.opacity(0.4))
            Text("No trips yet")
                .font(.title2).fontWeight(.semibold)
                .foregroundColor(PulseTheme.textPrimary)
            Text("Complete your first trip to see your driving score and potential insurance discount.")
                .font(.subheadline)
                .foregroundColor(PulseTheme.textSecondary)
                .multilineTextAlignment(.center)
        }
        .padding(40)
    }
}
