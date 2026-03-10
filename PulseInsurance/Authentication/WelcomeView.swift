import SwiftUI

struct WelcomeView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @State private var showSignUp = false
    @State private var showSignIn = false

    var body: some View {
        NavigationStack {
            ZStack {
                // Background gradient
                LinearGradient(
                    colors: [PulseTheme.primaryBlue, PulseTheme.primaryBlue.opacity(0.7)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                VStack(spacing: 0) {
                    Spacer()

                    // Logo area
                    VStack(spacing: 16) {
                        Image(systemName: "car.circle.fill")
                            .resizable()
                            .frame(width: 90, height: 90)
                            .foregroundColor(.white)

                        Text("Pulse Insurance")
                            .font(.system(size: 34, weight: .bold))
                            .foregroundColor(.white)

                        Text("Drive smart. Pay fair.")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(.white.opacity(0.85))
                    }

                    Spacer()

                    // Feature pills
                    HStack(spacing: 12) {
                        FeaturePill(icon: "gauge.high", label: "Speed")
                        FeaturePill(icon: "arrow.up.circle", label: "Acceleration")
                        FeaturePill(icon: "arrow.down.circle", label: "Braking")
                    }
                    .padding(.bottom, 48)

                    // Buttons
                    VStack(spacing: 14) {
                        Button("Get Started") { showSignUp = true }
                            .buttonStyle(PulseButtonStyle())
                            .padding(.horizontal, 24)
                            .tint(.white)
                            .foregroundColor(PulseTheme.primaryBlue)
                            .background(.white)
                            .cornerRadius(14)
                            .frame(maxWidth: .infinity, minHeight: 54)
                            .padding(.horizontal, 24)

                        Button("Sign In") { showSignIn = true }
                            .font(.system(size: 17, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity, minHeight: 54)
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .stroke(.white.opacity(0.6), lineWidth: 1.5)
                            )
                            .padding(.horizontal, 24)
                    }
                    .padding(.bottom, 48)
                }
            }
            .navigationDestination(isPresented: $showSignUp) {
                SignUpContainerView()
                    .environmentObject(authViewModel)
            }
            .navigationDestination(isPresented: $showSignIn) {
                SignInView()
                    .environmentObject(authViewModel)
            }
        }
    }
}

private struct FeaturePill: View {
    let icon: String
    let label: String

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 14))
            Text(label)
                .font(.system(size: 13, weight: .medium))
        }
        .foregroundColor(.white)
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .background(.white.opacity(0.20))
        .cornerRadius(20)
    }
}
