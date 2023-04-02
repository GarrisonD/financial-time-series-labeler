/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  // https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping
  // As `compilerOptions.baseUrl` in tsconfig.json:
  modulePaths: ["src"],
};
