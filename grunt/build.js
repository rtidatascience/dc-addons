module.exports = function(grunt) {
    grunt.registerTask('build', [
        'notify:build',
        'jshint:lib',
        'jshint:tests',
        'jshint:grunt',
        'jscs:lib',
        'jscs:tests',
        'jscs:grunt',
        //'karma:build',
        'clean:build',
        'concat:build',
        'uglify:build',
        'notify:buildComplete'
    ]);
};
