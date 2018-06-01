module.exports = (jestConfig) => Object.assign(jestConfig, {
    setupFiles: [require.resolve('./lib/jest.setup')]
});