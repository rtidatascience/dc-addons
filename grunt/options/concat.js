module.exports = {
    options: {
        stripBanners: true,
        sourceMap: false,
        banner: '/*!\n * <%= config.pkg.name %> v<%= config.pkg.version %>\n ' +
                '*\n * <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\n *\n */\n'
    },
    leaflet: {
        dest: '<%= config.dist %>/dc-leaflet.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/base-map-chart.js',
            '<%= config.src %>/<%= config.scripts %>/base-leaflet-chart.js',
            '<%= config.src %>/<%= config.scripts %>/leaflet-choropleth-chart.js',
            '<%= config.src %>/<%= config.scripts %>/leaflet-marker-chart.js',
        ]
    },
    google: {
        dest: '<%= config.dist %>/dc-google.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/base-map-chart.js',
            '<%= config.src %>/<%= config.scripts %>/base-google-chart.js',
            '<%= config.src %>/<%= config.scripts %>/google-choropleth-chart.js',
            '<%= config.src %>/<%= config.scripts %>/google-marker-chart.js',
        ]
    },
    tooltip: {
        dest: '<%= config.dist %>/dc-tooltip-mixin.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/tooltip-mixin.js',
        ]
    },
    build: {
        dest: '<%= config.dist %>/dc-addons.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/base-map-chart.js',
            '<%= config.src %>/<%= config.scripts %>/base-leaflet-chart.js',
            '<%= config.src %>/<%= config.scripts %>/leaflet-choropleth-chart.js',
            '<%= config.src %>/<%= config.scripts %>/leaflet-marker-chart.js',
            '<%= config.src %>/<%= config.scripts %>/base-google-chart.js',
            '<%= config.src %>/<%= config.scripts %>/google-choropleth-chart.js',
            '<%= config.src %>/<%= config.scripts %>/google-marker-chart.js',
            '<%= config.src %>/<%= config.scripts %>/tooltip-mixin.js',
        ]
    },
};
