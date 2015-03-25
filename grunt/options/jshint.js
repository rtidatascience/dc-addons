module.exports = {
    options: {
        curly: true, // don't allow non curly statements,
        eqeqeq: true,
        futurehostile: true,
        maxdepth: 3,
        notypeof: true,
        unused: true,
        globals: {
            // js globals
            dc: true,
            L: true,
            console: true,
            // grunt globals
            module: true,
            require: true,
            process: true,
        }
    },
    lib: [
        '<%= config.lib %>/**/*.js',
    ],
    tests: [
        '<%= config.tests %>/**/*.js'
    ],
    grunt: [
        'Gruntfile.js',
        '<%= config.grunt %>/**/*.js'
    ]
};
