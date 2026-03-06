import SwiftUI

struct SignInView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @Environment(\.dismiss) var dismiss

    @State private var email = ""
    @State private var password = ""
    @State private var showPassword = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 32) {

                VStack(alignment: .leading, spacing: 8) {
                    Text("Welcome back")
                        .font(.system(size: 30, weight: .bold))
                        .foregroundColor(PulseTheme.textPrimary)
                    Text("Sign in to your Pulse Insurance account")
                        .font(.subheadline)
                        .foregroundColor(PulseTheme.textSecondary)
                }
                .padding(.top, 8)

                VStack(spacing: 16) {
                    PulseTextField(
                        title: "Email address",
                        placeholder: "you@example.com",
                        text: $email,
                        keyboardType: .emailAddress,
                        autocapitalization: .never
                    )

                    PulseSecureField(
                        title: "Password",
                        placeholder: "Enter your password",
                        text: $password
                    )
                }

                if let error = authViewModel.errorMessage {
                    HStack(spacing: 8) {
                        Image(systemName: "exclamationmark.circle.fill")
                        Text(error)
                            .font(.subheadline)
                    }
                    .foregroundColor(PulseTheme.dangerRed)
                    .padding(12)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(PulseTheme.dangerRed.opacity(0.08))
                    .cornerRadius(10)
                }

                Button {
                    Task { await authViewModel.signIn(email: email, password: password) }
                } label: {
                    if authViewModel.isLoading {
                        ProgressView().tint(.white)
                    } else {
                        Text("Sign In")
                    }
                }
                .buttonStyle(PulseButtonStyle())
                .disabled(email.isEmpty || password.isEmpty || authViewModel.isLoading)
            }
            .padding(24)
        }
        .background(PulseTheme.backgroundGray.ignoresSafeArea())
        .navigationTitle("Sign In")
        .navigationBarTitleDisplayMode(.inline)
    }
}
