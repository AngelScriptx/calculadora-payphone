// jest.config.mjs
export default {
  preset: "ts-jest/presets/default-esm", // importante para ESM
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }]
  },
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "tsconfig.json"
    }
  }
};
