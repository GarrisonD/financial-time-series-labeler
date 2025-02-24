/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  passWithNoTests: true,

  preset: "ts-jest",
  testEnvironment: "jsdom",

  // https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping
  // As `compilerOptions.baseUrl` in tsconfig.json:
  modulePaths: ["src"],
};
