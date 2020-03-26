module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],

  setupFiles: ['./config/setup-jest.js'],

  testPathIgnorePatterns: ['node_modules', 'dist'],

  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@interfaces/(.*)$': '<rootDir>/interfaces/$1',
    '^@server/(.*)$': '<rootDir>/server/$1',
  },
};
