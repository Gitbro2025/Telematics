import Foundation

struct DriverScore: Codable {
    var userId: String
    var overallScore: Double       // 0–100
    var accelerationScore: Double
    var brakingScore: Double
    var speedingScore: Double
    var daytimeScore: Double
    var nighttimeScore: Double
    var totalTrips: Int
    var totalDistanceKm: Double
    var totalDrivingHours: Double
    var lastUpdated: Date

    var discountPercentage: Double {
        // 0–25% premium discount based on score
        switch overallScore {
        case 90...100: return 25.0
        case 80..<90:  return 18.0
        case 70..<80:  return 12.0
        case 60..<70:  return 6.0
        default:       return 0.0
        }
    }

    var grade: String {
        switch overallScore {
        case 90...100: return "A"
        case 80..<90:  return "B"
        case 70..<80:  return "C"
        case 60..<70:  return "D"
        default:       return "E"
        }
    }

    static var empty: DriverScore {
        DriverScore(
            userId: "",
            overallScore: 0,
            accelerationScore: 0,
            brakingScore: 0,
            speedingScore: 0,
            daytimeScore: 0,
            nighttimeScore: 0,
            totalTrips: 0,
            totalDistanceKm: 0,
            totalDrivingHours: 0,
            lastUpdated: Date()
        )
    }
}
