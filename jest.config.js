module.exports = {
    roots: [
        "<rootDir>/tests"
    ],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    preset: "jest-puppeteer",
    globalSetup: './jest.global-setup.ts',
}