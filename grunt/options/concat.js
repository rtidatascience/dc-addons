module.exports = {
    options: {
        stripBanners: true,
        sourceMap: false,
        banner: '/*!\n * <%= config.pkg.name %> v<%= config.pkg.version %>\n ' +
                '*\n * <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\n *\n */\n'
    },
    leaflet: {
        dest: '<%= config.dist %>/leaflet-map/dc-leaflet.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/base-map-chart.js',
            '<%= config.src %>/<%= config.scripts %>/base-leaflet-chart.js',
            '<%= config.src %>/<%= config.scripts %>/leaflet-choropleth-chart.js',
            '<%= config.src %>/<%= config.scripts %>/leaflet-marker-chart.js',
        ]
    },
    google: {
        dest: '<%= config.dist %>/google-map/dc-google.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/base-map-chart.js',
            '<%= config.src %>/<%= config.scripts %>/base-google-chart.js',
            '<%= config.src %>/<%= config.scripts %>/google-choropleth-chart.js',
            '<%= config.src %>/<%= config.scripts %>/google-marker-chart.js',
        ]
    },
    tooltip: {
        dest: '<%= config.dist %>/tooltip/dc-tooltip-mixin.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/tooltip-mixin.js',
        ]
    },
    bubble: {
        dest: '<%= config.dist %>/bubble-cloud/dc-bubble-cloud.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/bubble-cloud.js',
        ]
    },
    pairedRow: {
        dest: '<%= config.dist %>/paired-row/dc-paired-row-chart.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/paired-row-chart.js',
        ]
    },
    serverChart: {
        dest: '<%= config.dist %>/server/dc-server-chart.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/server-chart.js',
        ]
    },
    serverChartAnimations: {
        dest: '<%= config.dist %>/server/dc-server-chart-with-animations.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/server-chart.js',
            '<%= config.src %>/<%= config.scripts %>/server-chart-animations.js',
        ]
    },
    server: {
        dest: '<%= config.dist %>/server/dc-server.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/server.js',
        ]
    },
    serverConfig: {
        dest: '<%= config.dist %>/server/server-config.js',
        src: [
            '<%= config.src %>/<%= config.scripts %>/server-config.js',
        ]
    },
    serverHtml: {
        options: {
            banner: '',
        },
        dest: '<%= config.dist %>/server/jsdom.html',
        src: [
            '<%= config.src %>/<%= config.scripts %>/jsdom.html',
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
            '<%= config.src %>/<%= config.scripts %>/bubble-cloud.js',
            '<%= config.src %>/<%= config.scripts %>/paired-row-chart.js',
            '<%= config.src %>/<%= config.scripts %>/server-chart.js',
            '<%= config.src %>/<%= config.scripts %>/server-chart-animations.js',
        ]
    },
};
