import Foundation

struct User: Codable, Identifiable {
    var id: String
    var email: String
    var firstName: String
    var lastName: String
    var phoneNumber: String
    var address: Address
    var vehicle: Vehicle
    var insuranceHistory: InsuranceHistory
    var createdAt: Date

    struct Address: Codable {
        var line1: String
        var line2: String
        var city: String
        var county: String
        var postcode: String
    }

    struct Vehicle: Codable {
        var make: String
        var model: String
        var year: Int
        var registrationNumber: String
        var engineSize: String
    }

    struct InsuranceHistory: Codable {
        var currentInsurer: String
        var yearsWithInsurer: Int
        var claimsLastThreeYears: Int
        var claimsDetails: [Claim]

        struct Claim: Codable, Identifiable {
            var id: String
            var year: Int
            var description: String
            var atFault: Bool
        }
    }
}

// MARK: - Sign-up form data (mutable before submission)
class SignUpFormData: ObservableObject {
    // Step 1 – Account
    @Published var email: String = ""
    @Published var password: String = ""
    @Published var confirmPassword: String = ""

    // Step 2 – Personal details
    @Published var firstName: String = ""
    @Published var lastName: String = ""
    @Published var phoneNumber: String = ""

    // Step 3 – Address
    @Published var addressLine1: String = ""
    @Published var addressLine2: String = ""
    @Published var city: String = ""
    @Published var county: String = ""
    @Published var postcode: String = ""

    // Step 4 – Vehicle
    @Published var vehicleMake: String = ""
    @Published var vehicleModel: String = ""
    @Published var vehicleYear: String = ""
    @Published var registrationNumber: String = ""
    @Published var engineSize: String = ""

    // Step 5 – Insurance history
    @Published var currentInsurer: String = ""
    @Published var yearsWithInsurer: String = ""
    @Published var claimsLastThreeYears: String = "0"

    var isStep1Valid: Bool {
        !email.isEmpty && email.contains("@") &&
        password.count >= 8 && password == confirmPassword
    }

    var isStep2Valid: Bool {
        !firstName.isEmpty && !lastName.isEmpty && phoneNumber.count >= 10
    }

    var isStep3Valid: Bool {
        !addressLine1.isEmpty && !city.isEmpty && !postcode.isEmpty
    }

    var isStep4Valid: Bool {
        !vehicleMake.isEmpty && !vehicleModel.isEmpty &&
        !vehicleYear.isEmpty && !registrationNumber.isEmpty
    }

    var isStep5Valid: Bool {
        !currentInsurer.isEmpty && !yearsWithInsurer.isEmpty
    }
}
