import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var telematicsEngine = TelematicsEngine()

    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Label("Dashboard", systemImage: "speedometer")
                }
                .environmentObject(telematicsEngine)

            TripHistoryView()
                .tabItem {
                    Label("Trips", systemImage: "map")
                }
                .environmentObject(telematicsEngine)

            ScoreView()
                .tabItem {
                    Label("Score", systemImage: "star.circle")
                }
                .environmentObject(telematicsEngine)

            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.circle")
                }
                .environmentObject(authViewModel)
        }
        .accentColor(PulseTheme.primaryBlue)
    }
}
