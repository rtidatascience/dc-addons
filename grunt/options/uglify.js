module.exports = {
    options: {
        sourceMap: true,
        sourceMapName: '<%= config.dist %>/dc-leaflet.min.map',
        preserveComments: 'some'
    },
    build: {
        files: {
            '<%= config.dist %>/dc-leaflet.min.js': '<%= config.dist %>/dc-leaflet.js'
        }
    }
};
