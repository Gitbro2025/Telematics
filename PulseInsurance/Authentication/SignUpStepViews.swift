import SwiftUI

// MARK: - Step 1: Account credentials
struct SignUpStep1AccountView: View {
    @ObservedObject var form: SignUpFormData

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                StepHeader(
                    icon: "envelope.circle.fill",
                    title: "Create your account",
                    subtitle: "We'll use your email to manage your policy"
                )

                VStack(spacing: 14) {
                    PulseTextField(
                        title: "Email address",
                        placeholder: "you@example.com",
                        text: $form.email,
                        keyboardType: .emailAddress,
                        autocapitalization: .never
                    )

                    PulseSecureField(
                        title: "Password",
                        placeholder: "Minimum 8 characters",
                        text: $form.password
                    )

                    PulseSecureField(
                        title: "Confirm password",
                        placeholder: "Repeat your password",
                        text: $form.confirmPassword
                    )

                    if !form.password.isEmpty && !form.confirmPassword.isEmpty
                        && form.password != form.confirmPassword {
                        HStack {
                            Image(systemName: "xmark.circle.fill")
                            Text("Passwords do not match")
                        }
                        .font(.caption)
                        .foregroundColor(PulseTheme.dangerRed)
                    }
                }
            }
            .padding(24)
        }
    }
}

// MARK: - Step 2: Personal details
struct SignUpStep2PersonalView: View {
    @ObservedObject var form: SignUpFormData

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                StepHeader(
                    icon: "person.circle.fill",
                    title: "Personal details",
                    subtitle: "Your name and contact information"
                )

                VStack(spacing: 14) {
                    HStack(spacing: 12) {
                        PulseTextField(title: "First name", placeholder: "John", text: $form.firstName)
                        PulseTextField(title: "Last name", placeholder: "Smith", text: $form.lastName)
                    }

                    PulseTextField(
                        title: "Phone number",
                        placeholder: "07700 900000",
                        text: $form.phoneNumber,
                        keyboardType: .phonePad
                    )
                }
            }
            .padding(24)
        }
    }
}

// MARK: - Step 3: Address
struct SignUpStep3AddressView: View {
    @ObservedObject var form: SignUpFormData

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                StepHeader(
                    icon: "house.circle.fill",
                    title: "Home address",
                    subtitle: "Your registered address for the policy"
                )

                VStack(spacing: 14) {
                    PulseTextField(title: "Address line 1", placeholder: "12 Example Street", text: $form.addressLine1)
                    PulseTextField(title: "Address line 2 (optional)", placeholder: "Flat, suite, etc.", text: $form.addressLine2)
                    PulseTextField(title: "Town / City", placeholder: "London", text: $form.city)
                    PulseTextField(title: "County", placeholder: "Greater London", text: $form.county)
                    PulseTextField(
                        title: "Postcode",
                        placeholder: "SW1A 2AA",
                        text: $form.postcode,
                        autocapitalization: .characters
                    )
                }
            }
            .padding(24)
        }
    }
}

// MARK: - Step 4: Vehicle
struct SignUpStep4VehicleView: View {
    @ObservedObject var form: SignUpFormData

    private let currentYear = Calendar.current.component(.year, from: Date())

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                StepHeader(
                    icon: "car.circle.fill",
                    title: "Your vehicle",
                    subtitle: "The car you'll be insuring"
                )

                VStack(spacing: 14) {
                    HStack(spacing: 12) {
                        PulseTextField(title: "Make", placeholder: "Toyota", text: $form.vehicleMake)
                        PulseTextField(title: "Model", placeholder: "Yaris", text: $form.vehicleModel)
                    }

                    HStack(spacing: 12) {
                        PulseTextField(
                            title: "Year",
                            placeholder: "\(currentYear)",
                            text: $form.vehicleYear,
                            keyboardType: .numberPad
                        )
                        PulseTextField(title: "Engine size", placeholder: "1.0L", text: $form.engineSize)
                    }

                    PulseTextField(
                        title: "Registration number",
                        placeholder: "AB12 CDE",
                        text: $form.registrationNumber,
                        autocapitalization: .characters
                    )
                }
            }
            .padding(24)
        }
    }
}

// MARK: - Step 5: Insurance history
struct SignUpStep5InsuranceView: View {
    @ObservedObject var form: SignUpFormData

    private let yearOptions = (0...30).map { $0 }
    private let claimOptions = ["0", "1", "2", "3", "4", "5+"]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                StepHeader(
                    icon: "shield.circle.fill",
                    title: "Insurance history",
                    subtitle: "This helps us calculate your personalised quote"
                )

                VStack(spacing: 14) {
                    PulseTextField(
                        title: "Current insurer",
                        placeholder: "e.g. Admiral, Aviva, Direct Line",
                        text: $form.currentInsurer
                    )

                    PulseTextField(
                        title: "Years with current insurer",
                        placeholder: "e.g. 3",
                        text: $form.yearsWithInsurer,
                        keyboardType: .numberPad
                    )

                    VStack(alignment: .leading, spacing: 6) {
                        Text("Claims in the last 3 years")
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(PulseTheme.textPrimary)

                        HStack(spacing: 10) {
                            ForEach(claimOptions, id: \.self) { option in
                                Button {
                                    form.claimsLastThreeYears = option
                                } label: {
                                    Text(option)
                                        .font(.system(size: 15, weight: .semibold))
                                        .foregroundColor(
                                            form.claimsLastThreeYears == option
                                            ? .white : PulseTheme.textPrimary
                                        )
                                        .frame(width: 46, height: 46)
                                        .background(
                                            form.claimsLastThreeYears == option
                                            ? PulseTheme.primaryBlue
                                            : PulseTheme.primaryBlue.opacity(0.08)
                                        )
                                        .cornerRadius(10)
                                }
                            }
                        }
                    }

                    // Disclaimer
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: "info.circle")
                            .foregroundColor(PulseTheme.primaryBlue)
                        Text("Your driving data is used solely for calculating your insurance premium and improving road safety.")
                            .font(.caption)
                            .foregroundColor(PulseTheme.textSecondary)
                    }
                    .padding(12)
                    .background(PulseTheme.primaryBlue.opacity(0.06))
                    .cornerRadius(10)
                }
            }
            .padding(24)
        }
    }
}

// MARK: - Shared helpers

struct StepHeader: View {
    let icon: String
    let title: String
    let subtitle: String

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 36))
                .foregroundColor(PulseTheme.primaryBlue)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(PulseTheme.textPrimary)
                Text(subtitle)
                    .font(.subheadline)
                    .foregroundColor(PulseTheme.textSecondary)
            }
        }
    }
}

struct PulseTextField: View {
    let title: String
    let placeholder: String
    @Binding var text: String
    var keyboardType: UIKeyboardType = .default
    var autocapitalization: TextInputAutocapitalization = .words

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(PulseTheme.textPrimary)

            TextField(placeholder, text: $text)
                .keyboardType(keyboardType)
                .textInputAutocapitalization(autocapitalization)
                .autocorrectionDisabled()
                .padding(14)
                .background(PulseTheme.cardWhite)
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(PulseTheme.primaryBlue.opacity(text.isEmpty ? 0.15 : 0.45), lineWidth: 1)
                )
        }
    }
}

struct PulseSecureField: View {
    let title: String
    let placeholder: String
    @Binding var text: String
    @State private var isVisible = false

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(PulseTheme.textPrimary)

            HStack {
                Group {
                    if isVisible {
                        TextField(placeholder, text: $text)
                    } else {
                        SecureField(placeholder, text: $text)
                    }
                }
                .autocorrectionDisabled()
                .textInputAutocapitalization(.never)

                Button {
                    isVisible.toggle()
                } label: {
                    Image(systemName: isVisible ? "eye.slash" : "eye")
                        .foregroundColor(PulseTheme.textSecondary)
                }
            }
            .padding(14)
            .background(PulseTheme.cardWhite)
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(PulseTheme.primaryBlue.opacity(text.isEmpty ? 0.15 : 0.45), lineWidth: 1)
            )
        }
    }
}
