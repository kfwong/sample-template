module.exports = {
    testTimeout: 60000,
    preset: './jest-preset.js',
    setupFiles: ['<rootDir>/jest.environment.js'],
    coverageReporters: ['json-summary', 'text'],
    coverageThreshold: {
        global: {
            lines: 65,
            statements: 65,
        },
    },
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: './test-results',
                outputName: 'junit.xml',
            },
        ],
    ],
};
