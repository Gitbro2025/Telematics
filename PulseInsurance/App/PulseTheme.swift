import SwiftUI

enum PulseTheme {
    static let primaryBlue  = Color(red: 0.04, green: 0.28, blue: 0.68)   // #0A47AD
    static let accentOrange = Color(red: 0.97, green: 0.53, blue: 0.11)   // #F78720
    static let backgroundGray = Color(red: 0.96, green: 0.96, blue: 0.97) // #F5F5F8
    static let cardWhite    = Color.white
    static let successGreen = Color(red: 0.18, green: 0.72, blue: 0.44)   // #2EB871
    static let warningAmber = Color(red: 0.97, green: 0.76, blue: 0.10)   // #F7C21A
    static let dangerRed    = Color(red: 0.91, green: 0.24, blue: 0.24)   // #E83D3D
    static let textPrimary  = Color(red: 0.11, green: 0.11, blue: 0.18)   // #1C1C2E
    static let textSecondary = Color(red: 0.44, green: 0.44, blue: 0.50)  // #717180

    static func scoreColor(for score: Double) -> Color {
        switch score {
        case 85...100: return successGreen
        case 65..<85:  return warningAmber
        default:       return dangerRed
        }
    }
}

// MARK: - Reusable card modifier
struct PulseCard: ViewModifier {
    func body(content: Content) -> some View {
        content
            .background(PulseTheme.cardWhite)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.06), radius: 8, x: 0, y: 2)
    }
}

extension View {
    func pulseCard() -> some View { modifier(PulseCard()) }
}

// MARK: - Primary button style
struct PulseButtonStyle: ButtonStyle {
    var isDestructive: Bool = false

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 17, weight: .semibold))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity, minHeight: 54)
            .background(isDestructive ? PulseTheme.dangerRed : PulseTheme.primaryBlue)
            .cornerRadius(14)
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}

// MARK: - Secondary button style
struct PulseSecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 17, weight: .semibold))
            .foregroundColor(PulseTheme.primaryBlue)
            .frame(maxWidth: .infinity, minHeight: 54)
            .background(PulseTheme.primaryBlue.opacity(0.10))
            .cornerRadius(14)
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}
