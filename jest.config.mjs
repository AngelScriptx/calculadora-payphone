// jest.config.mjs
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"],
  globals: {
    "ts-jest": {
      useESM: true, // habilita compatibilidad ESM
      tsconfig: "tsconfig.json"
    }
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }]
  }
};
