import Foundation
import CoreMotion
import Combine

final class MotionService: ObservableObject {
    private let motionManager = CMMotionManager()
    private let queue = OperationQueue()

    // Gravity-corrected longitudinal acceleration (positive = accelerating, negative = braking)
    @Published var longitudinalAcceleration: Double = 0  // g-force
    @Published var lateralAcceleration: Double = 0       // g-force (cornering)
    @Published var isAvailable: Bool = false

    // Rolling 1-second smoothed value
    private var rawBuffer: [Double] = []
    private let bufferSize = 10    // at 100 Hz → 100ms window

    init() {
        isAvailable = motionManager.isDeviceMotionAvailable
        queue.maxConcurrentOperationCount = 1
    }

    func start() {
        guard motionManager.isDeviceMotionAvailable else { return }
        motionManager.deviceMotionUpdateInterval = 1.0 / 100.0   // 100 Hz
        motionManager.startDeviceMotionUpdates(using: .xArbitraryZVertical, to: queue) { [weak self] motion, _ in
            guard let self, let motion else { return }
            // In xArbitraryZVertical: x=lateral, y=longitudinal (forward/back), z=vertical
            let lon = motion.userAcceleration.y   // forward positive
            let lat = motion.userAcceleration.x

            self.rawBuffer.append(lon)
            if self.rawBuffer.count > self.bufferSize { self.rawBuffer.removeFirst() }
            let smoothed = self.rawBuffer.reduce(0, +) / Double(self.rawBuffer.count)

            DispatchQueue.main.async {
                self.longitudinalAcceleration = smoothed
                self.lateralAcceleration = lat
            }
        }
    }

    func stop() {
        motionManager.stopDeviceMotionUpdates()
        rawBuffer.removeAll()
    }
}
