module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  rootDir: "./",
  moduleNameMapper: {
    "^@prisma/client$": "<rootDir>/../database/node_modules/@prisma/client",
    "^@prisma/client/(.*)$": "<rootDir>/../database/node_modules/@prisma/client/$1",
  },
};
