module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  resolver: '<rootDir>/test/jest-resolver.js',
  transformIgnorePatterns: ['/node_modules/(?!(uuid)/)'],
};
