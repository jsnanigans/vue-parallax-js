module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testMatch: [
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.spec.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov'],
  setupFiles: ['<rootDir>/tests/setup.js']
}
