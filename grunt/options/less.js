module.exports = function () {
    return {
        options: {
            strictMath: true,
        },
        tooltip: {
            dest: '<%= config.dist %>/tooltip/dc-tooltip-mixin.css',
            src: [
                '<%= config.src %>/<%= config.less %>/tooltip-mixin.less'
            ]
        },
        build: {
            dest: '<%= config.dist %>/dc-addons.css',
            src: [
                '<%= config.src %>/<%= config.less %>/tooltip-mixin.less'
            ]
        },
    };
};
