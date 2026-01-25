// jest.config.mjs
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"], 
  globals: {
    "ts-jest": {
      useESM: true
    }
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }]
  },
  extensionsToTreatAsEsm: [".ts"]
};
