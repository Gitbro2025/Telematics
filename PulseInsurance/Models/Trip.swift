import Foundation
import CoreLocation

struct Trip: Codable, Identifiable {
    var id: String
    var startDate: Date
    var endDate: Date?
    var distanceKm: Double
    var durationSeconds: Double
    var timeOfDay: TimeOfDay
    var telematicsScore: TelematicsScore
    var events: [DrivingEvent]
    var routePoints: [RoutePoint]

    enum TimeOfDay: String, Codable, CaseIterable {
        case daytime = "Daytime"
        case nighttime = "Night-time"

        static func classify(for date: Date) -> TimeOfDay {
            let hour = Calendar.current.component(.hour, from: date)
            return (hour >= 7 && hour < 21) ? .daytime : .nighttime
        }
    }

    struct TelematicsScore: Codable {
        var overall: Double           // 0–100
        var accelerationScore: Double
        var brakingScore: Double
        var speedingScore: Double
        var grade: Grade

        enum Grade: String, Codable {
            case excellent = "Excellent"
            case good      = "Good"
            case fair      = "Fair"
            case poor      = "Poor"

            static func from(score: Double) -> Grade {
                switch score {
                case 90...100: return .excellent
                case 75..<90:  return .good
                case 55..<75:  return .fair
                default:       return .poor
                }
            }
        }
    }

    struct RoutePoint: Codable {
        var latitude: Double
        var longitude: Double
        var timestamp: Date
        var speedKmh: Double
    }
}

struct DrivingEvent: Codable, Identifiable {
    var id: String
    var type: EventType
    var severity: Severity
    var timestamp: Date
    var speedKmh: Double
    var latitude: Double
    var longitude: Double

    enum EventType: String, Codable {
        case hardAcceleration  = "Hard Acceleration"
        case hardBraking       = "Hard Braking"
        case speeding          = "Speeding"
        case mildAcceleration  = "Mild Acceleration"
        case mildBraking       = "Mild Braking"
    }

    enum Severity: String, Codable {
        case low    = "Low"
        case medium = "Medium"
        case high   = "High"

        var penaltyPoints: Double {
            switch self {
            case .low:    return 1
            case .medium: return 3
            case .high:   return 6
            }
        }
    }
}
