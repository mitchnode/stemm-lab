module.exports = {
  preset: "jest-expo",
  globals: {
    __DEV__: true,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  modulePathIgnorePatterns: [
    "<rootDir>/node_modules/firebase",
    "<rootDir>/node_modules/@firebase",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|firebase|@firebase)",
  ],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
};
