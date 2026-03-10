import Foundation

final class TripStorageService {
    static let shared = TripStorageService()
    private let key = "pulse_trips"

    func save(_ trips: [Trip]) {
        if let data = try? JSONEncoder().encode(trips) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }

    func load() -> [Trip] {
        guard let data = UserDefaults.standard.data(forKey: key),
              let trips = try? JSONDecoder().decode([Trip].self, from: data)
        else { return [] }
        return trips
    }

    func append(_ trip: Trip) {
        var trips = load()
        trips.insert(trip, at: 0)
        save(trips)
    }
}
