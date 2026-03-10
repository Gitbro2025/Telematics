import Foundation
import Combine

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var isAuthenticated: Bool = false
    @Published var currentUser: User?
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?

    private let authService = AuthService.shared

    init() {
        // Restore existing session on launch
        if let user = authService.restoreSession() {
            currentUser = user
            isAuthenticated = true
        }
    }

    func signIn(email: String, password: String) async {
        isLoading = true
        errorMessage = nil
        do {
            let user = try await authService.signIn(email: email, password: password)
            currentUser = user
            isAuthenticated = true
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func register(from form: SignUpFormData) async {
        isLoading = true
        errorMessage = nil
        do {
            let user = try await authService.register(from: form)
            currentUser = user
            isAuthenticated = true
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func signOut() {
        authService.signOut()
        currentUser = nil
        isAuthenticated = false
    }
}
