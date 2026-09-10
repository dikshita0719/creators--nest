module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  moduleNameMapper: {
    '^@creators/types$': '<rootDir>/../../packages/types/src/index.ts',
  },
};
