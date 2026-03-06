import Foundation
import Combine

// MARK: - AuthService handles local persistence and simulated auth
// Replace signIn/register internals with your backend calls (e.g. Firebase Auth)
final class AuthService {
    static let shared = AuthService()

    private let userKey = "pulse_current_user"
    private let sessionKey = "pulse_session_token"

    // MARK: - Sign In
    func signIn(email: String, password: String) async throws -> User {
        // TODO: replace with real network call
        guard let data = UserDefaults.standard.data(forKey: userKey),
              let user = try? JSONDecoder().decode(User.self, from: data),
              user.email.lowercased() == email.lowercased() else {
            throw AuthError.invalidCredentials
        }
        UserDefaults.standard.set("mock_token_\(user.id)", forKey: sessionKey)
        return user
    }

    // MARK: - Register
    func register(from form: SignUpFormData) async throws -> User {
        // Basic uniqueness guard (in production use your backend)
        let user = User(
            id: UUID().uuidString,
            email: form.email.lowercased(),
            firstName: form.firstName,
            lastName: form.lastName,
            phoneNumber: form.phoneNumber,
            address: User.Address(
                line1: form.addressLine1,
                line2: form.addressLine2,
                city: form.city,
                county: form.county,
                postcode: form.postcode.uppercased()
            ),
            vehicle: User.Vehicle(
                make: form.vehicleMake,
                model: form.vehicleModel,
                year: Int(form.vehicleYear) ?? 2020,
                registrationNumber: form.registrationNumber.uppercased(),
                engineSize: form.engineSize
            ),
            insuranceHistory: User.InsuranceHistory(
                currentInsurer: form.currentInsurer,
                yearsWithInsurer: Int(form.yearsWithInsurer) ?? 0,
                claimsLastThreeYears: Int(form.claimsLastThreeYears) ?? 0,
                claimsDetails: []
            ),
            createdAt: Date()
        )
        if let data = try? JSONEncoder().encode(user) {
            UserDefaults.standard.set(data, forKey: userKey)
        }
        UserDefaults.standard.set("mock_token_\(user.id)", forKey: sessionKey)
        return user
    }

    // MARK: - Session restoration
    func restoreSession() -> User? {
        guard UserDefaults.standard.string(forKey: sessionKey) != nil,
              let data = UserDefaults.standard.data(forKey: userKey),
              let user = try? JSONDecoder().decode(User.self, from: data)
        else { return nil }
        return user
    }

    // MARK: - Sign Out
    func signOut() {
        UserDefaults.standard.removeObject(forKey: sessionKey)
    }
}

enum AuthError: LocalizedError {
    case invalidCredentials
    case emailAlreadyInUse
    case networkError

    var errorDescription: String? {
        switch self {
        case .invalidCredentials: return "Incorrect email or password."
        case .emailAlreadyInUse: return "An account with this email already exists."
        case .networkError: return "Network error. Please try again."
        }
    }
}
