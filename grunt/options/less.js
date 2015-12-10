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
        leaflet: {
            dest: '<%= config.dist %>/leaflet/dc-leaflet-legend.css',
            src: [
                '<%= config.src %>/<%= config.less %>/leaflet-legend.less'
            ]
        },
        build: {
            dest: '<%= config.dist %>/dc-addons.css',
            src: [
                '<%= config.src %>/<%= config.less %>/tooltip-mixin.less',
                '<%= config.src %>/<%= config.less %>/leaflet-legend.less',
            ]
        },
    };
};
