module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      // The shared config only marks jest globals for .js/.ts/.tsx tests.
      files: ['__tests__/**/*.{js,jsx,ts,tsx}'],
      env: { jest: true },
    },
  ],
};
