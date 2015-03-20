module.exports = {
    options: {
        stripBanners: true,
        sourceMap: false,
        banner: '/*!\n * <%= config.pkg.name %> v<%= config.pkg.version %>\n * http://intellipharm.com/\n *\n * Copyright 2015 Intellipharm\n *\n * <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\n *\n */\n'
    },
    build: {
        dest: '<%= config.dist %>/dc-leaflet.js',
        src: [
            '<%= config.lib %>/**/*.js'
        ]
    }
};
