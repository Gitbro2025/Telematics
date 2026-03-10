import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @State private var showSignOutAlert = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    if let user = authViewModel.currentUser {
                        // Avatar header
                        VStack(spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(PulseTheme.primaryBlue.opacity(0.12))
                                    .frame(width: 88, height: 88)
                                Text(initials(for: user))
                                    .font(.system(size: 32, weight: .bold))
                                    .foregroundColor(PulseTheme.primaryBlue)
                            }
                            Text("\(user.firstName) \(user.lastName)")
                                .font(.title2).fontWeight(.bold)
                                .foregroundColor(PulseTheme.textPrimary)
                            Text(user.email)
                                .font(.subheadline)
                                .foregroundColor(PulseTheme.textSecondary)
                        }
                        .padding(.top, 8)

                        // Vehicle section
                        ProfileSection(title: "Vehicle") {
                            ProfileRow(label: "Make & Model", value: "\(user.vehicle.make) \(user.vehicle.model)")
                            ProfileRow(label: "Year", value: "\(user.vehicle.year)")
                            ProfileRow(label: "Registration", value: user.vehicle.registrationNumber)
                            if !user.vehicle.engineSize.isEmpty {
                                ProfileRow(label: "Engine", value: user.vehicle.engineSize)
                            }
                        }

                        // Contact section
                        ProfileSection(title: "Contact") {
                            ProfileRow(label: "Phone", value: user.phoneNumber)
                            ProfileRow(label: "Address", value: formattedAddress(user.address))
                        }

                        // Insurance history section
                        ProfileSection(title: "Insurance History") {
                            ProfileRow(label: "Current Insurer", value: user.insuranceHistory.currentInsurer)
                            ProfileRow(label: "Years with Insurer",
                                       value: "\(user.insuranceHistory.yearsWithInsurer) year(s)")
                            ProfileRow(label: "Claims (last 3 yrs)",
                                       value: "\(user.insuranceHistory.claimsLastThreeYears)")
                        }

                        // Member since
                        HStack {
                            Image(systemName: "calendar")
                                .foregroundColor(PulseTheme.primaryBlue)
                            Text("Member since \(user.createdAt.formatted(.dateTime.month().year()))")
                                .font(.subheadline)
                                .foregroundColor(PulseTheme.textSecondary)
                            Spacer()
                        }
                        .padding(16).pulseCard()

                        // Sign out
                        Button("Sign Out") { showSignOutAlert = true }
                            .buttonStyle(PulseButtonStyle(isDestructive: true))
                            .padding(.top, 8)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 32)
            }
            .background(PulseTheme.backgroundGray.ignoresSafeArea())
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.large)
            .alert("Sign Out", isPresented: $showSignOutAlert) {
                Button("Sign Out", role: .destructive) { authViewModel.signOut() }
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("Are you sure you want to sign out?")
            }
        }
    }

    private func initials(for user: User) -> String {
        let f = user.firstName.prefix(1)
        let l = user.lastName.prefix(1)
        return "\(f)\(l)".uppercased()
    }

    private func formattedAddress(_ addr: User.Address) -> String {
        var parts = [addr.line1]
        if !addr.line2.isEmpty { parts.append(addr.line2) }
        parts.append(addr.city)
        parts.append(addr.postcode)
        return parts.joined(separator: ", ")
    }
}

// MARK: - Helpers
private struct ProfileSection<Content: View>: View {
    let title: String
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
                .foregroundColor(PulseTheme.textPrimary)
            VStack(spacing: 0) {
                content
            }
        }
        .padding(16)
        .pulseCard()
    }
}

private struct ProfileRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .foregroundColor(PulseTheme.textSecondary)
                .frame(width: 140, alignment: .leading)
            Text(value)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(PulseTheme.textPrimary)
            Spacer()
        }
        .padding(.vertical, 6)
    }
}
