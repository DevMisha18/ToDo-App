/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // This is needed for Next.js specific modules
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
