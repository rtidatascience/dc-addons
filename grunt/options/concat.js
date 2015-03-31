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
            '<%= config.src %>/base-map-chart.js',
            '<%= config.src %>/base-leaflet-chart.js',
            '<%= config.src %>/leaflet-choropleth-chart.js',
            '<%= config.src %>/leaflet-marker-chart.js',
        ]
    },
    google: {
        dest: '<%= config.dist %>/dc-google.js',
        src: [
            '<%= config.src %>/base-map-chart.js',
            '<%= config.src %>/base-google-chart.js',
            '<%= config.src %>/google-choropleth-chart.js',
            '<%= config.src %>/google-marker-chart.js',
        ]
    },
    build: {
        dest: '<%= config.dist %>/dc-addons.js',
        src: '<%= config.dist %>/*.js'
    },
};
