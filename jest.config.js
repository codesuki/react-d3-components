module.exports = {
    snapshotSerializers: ['enzyme-to-json/serializer'],
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
        '/config/',
        '/__tests__/',
        '/src/Fragment.js',
        'src/utils/createRef.js'
    ]
};
