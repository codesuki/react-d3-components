module.exports = {
    setupTestFrameworkScriptFile: '<rootDir>config/setupTests.js',
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            statements: 90
        }
    },
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/lib/',
        '/dist/',
        '/config/'
    ]
};
