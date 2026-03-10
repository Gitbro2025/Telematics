import SwiftUI

/// Multi-step sign-up wizard
struct SignUpContainerView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var form = SignUpFormData()
    @State private var currentStep = 1
    private let totalSteps = 5

    var body: some View {
        VStack(spacing: 0) {
            // Progress bar
            StepProgressBar(current: currentStep, total: totalSteps)
                .padding(.horizontal, 24)
                .padding(.vertical, 16)

            // Step content
            Group {
                switch currentStep {
                case 1: SignUpStep1AccountView(form: form)
                case 2: SignUpStep2PersonalView(form: form)
                case 3: SignUpStep3AddressView(form: form)
                case 4: SignUpStep4VehicleView(form: form)
                case 5: SignUpStep5InsuranceView(form: form)
                default: EmptyView()
                }
            }
            .transition(.asymmetric(
                insertion: .move(edge: .trailing),
                removal: .move(edge: .leading)
            ))
            .animation(.easeInOut(duration: 0.28), value: currentStep)

            Spacer()

            // Navigation buttons
            HStack(spacing: 14) {
                if currentStep > 1 {
                    Button("Back") { withAnimation { currentStep -= 1 } }
                        .buttonStyle(PulseSecondaryButtonStyle())
                        .frame(maxWidth: .infinity)
                }

                if currentStep < totalSteps {
                    Button("Continue") { withAnimation { currentStep += 1 } }
                        .buttonStyle(PulseButtonStyle())
                        .disabled(!canAdvance)
                        .frame(maxWidth: .infinity)
                } else {
                    Button {
                        Task { await authViewModel.register(from: form) }
                    } label: {
                        if authViewModel.isLoading {
                            ProgressView().tint(.white)
                        } else {
                            Text("Create Account")
                        }
                    }
                    .buttonStyle(PulseButtonStyle())
                    .disabled(!canAdvance || authViewModel.isLoading)
                    .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 32)

            if let error = authViewModel.errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundColor(PulseTheme.dangerRed)
                    .padding(.horizontal, 24)
                    .padding(.bottom, 8)
            }
        }
        .background(PulseTheme.backgroundGray.ignoresSafeArea())
        .navigationTitle(stepTitle)
        .navigationBarTitleDisplayMode(.inline)
    }

    private var canAdvance: Bool {
        switch currentStep {
        case 1: return form.isStep1Valid
        case 2: return form.isStep2Valid
        case 3: return form.isStep3Valid
        case 4: return form.isStep4Valid
        case 5: return form.isStep5Valid
        default: return false
        }
    }

    private var stepTitle: String {
        switch currentStep {
        case 1: return "Create Account"
        case 2: return "Your Details"
        case 3: return "Address"
        case 4: return "Your Vehicle"
        case 5: return "Insurance History"
        default: return ""
        }
    }
}

// MARK: - Progress bar
private struct StepProgressBar: View {
    let current: Int
    let total: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Step \(current) of \(total)")
                .font(.caption)
                .foregroundColor(PulseTheme.textSecondary)

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(PulseTheme.primaryBlue.opacity(0.15)).frame(height: 6)
                    Capsule().fill(PulseTheme.primaryBlue)
                        .frame(width: geo.size.width * (Double(current) / Double(total)), height: 6)
                        .animation(.easeInOut, value: current)
                }
            }
            .frame(height: 6)
        }
    }
}
