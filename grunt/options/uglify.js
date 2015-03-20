module.exports = {
    build: {
        options: {
            sourceMap: true,
            sourceMapName: '<%= config.dist %>/dc-leaflet.min.map',
            preserveComments: 'some',
        },
        files: {
            '<%= config.dist %>/dc-leaflet.min.js': '<%= config.dist %>/dc-leaflet.js'
        }
    }
};
