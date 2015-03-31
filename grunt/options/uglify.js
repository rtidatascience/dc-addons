module.exports = {
    options: {
        sourceMap: true,
        screwIE8: true,
        preserveComments: 'some'
    },
    build: {
        files: [{
            expand: true,
            cwd: '<%= config.dist %>/',
            src: '*.js',
            dest: '<%= config.dist %>/',
            rename: function (dest, src) {
                return dest + src.replace('.js', '.min.js');
            }
      }]
    }
};
