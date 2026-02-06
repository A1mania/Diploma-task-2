const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "../test_jest",
  testMatch: ["<rootDir>/*.ts"]
  // testMatch: ["<rootDir>/**/*.spec.ts"], // см. ниже замечание
};

// запускать код с путем к конфигу можно вот так (так же адаптируйте путь)
// npx jest --config ./config/jest.config.js