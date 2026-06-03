module.exports = {
  preset: "jest-expo", // or whatever preset you are using
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
