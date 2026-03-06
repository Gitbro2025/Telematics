// swift-tools-version: 5.9
// Pulse Insurance – iOS Telematics App
// Open in Xcode by creating a new iOS App project and adding these sources,
// or use `xcodegen` with the project.yml below.

import PackageDescription

let package = Package(
    name: "PulseInsurance",
    platforms: [
        .iOS(.v16)
    ],
    targets: [
        .target(
            name: "PulseInsurance",
            path: ".",
            exclude: ["Package.swift"],
            sources: [
                "App",
                "Authentication",
                "Telematics",
                "Dashboard",
                "Models",
                "Services"
            ],
            resources: [
                .process("Resources")
            ]
        )
    ]
)
