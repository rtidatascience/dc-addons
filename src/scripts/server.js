// node modules
var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    jsdom = require('jsdom'),
    mysql = require('mysql'),
    crossfilter = require('crossfilter');

// local variables
var timing = [],
    configFile = process.argv[2];

function connect(config) {
    var connection = mysql.createConnection({
        host:     config.host,
        user:     config.username,
        password: config.password,
        database: config.database
    });

    connection.connect();

    return connection;
}

function execute(connection, sql, callback) {
    connection.query(sql, function (err, data) {
        if (err) {
            throw err;
        }

        console.log('Number of rows: ' + data.length);
        callback(crossfilter(data));
    });
}

function addTiming(name) {
    var time = new Date().getTime(),
        took = 0;

    if (timing.length > 0) {
        took = time - timing[timing.length - 1].time;
    }

    timing.push({name: name, took: took, time: time});
}

function logTiming() {
    console.log('---------------');
    console.log('Server Timing');
    var totalTime = timing[timing.length - 1].time - timing[0].time;

    for (var i = 0; i < timing.length; i++) {
        console.log(
            timing[i].name + ' took ' +
            (timing[i].took / 1000) + ' seconds (' +
            (timing[i].took / totalTime * 100).toFixed(3) + '%)'
        );
    }

    console.log('Total time: ' + (totalTime / 1000) + ' seconds');
    console.log('---------------');
    timing = [];
}

// socket connections
io.on('connection', function (socket) {
    var charts = [],
        w = null;

    socket.on('render', function (chartName) {
        addTiming('start');

        // clear the cache for the config file
        delete require.cache[require.resolve(configFile)];
        // load the config
        var c = require(configFile);
        var config = c[chartName];
        var preRender = [];
        charts = [];

        config.charts.forEach(function (chartConfig, chartIndex) {
            preRender.push({
                type: chartConfig.type,
                width: chartConfig.options.width,
                height: chartConfig.options.height
            });
        });

        socket.emit('preRender', preRender);

        if (!c.libraries) {
            config.libraries = {};
        }

        if (!c.libraries.d3) {
            c.libraries.d3 = 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js';
        }

        if (!c.libraries.crossfilter) {
            c.libraries.crossfilter = 'https://cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.11/crossfilter.min.js';
        }

        if (!c.libraries.dc) {
            c.libraries.dc = 'https://cdnjs.cloudflare.com/ajax/libs/dc/2.0.0-beta.12/dc.min.js';
        }

        var html = '<html>' +
            '<head>' +
                '<script src="' + c.libraries.d3 + '"></script>' +
                '<script src="' + c.libraries.crossfilter + '"></script>' +
                '<script src="' + c.libraries.dc + '"></script>' +
            '</head>' +
            '<body></body>' +
        '</html>';

        addTiming('config loaded');

        jsdom.env({
            features: {QuerySelector: true},
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            html: html,
            done: function (errors, window) {
                addTiming('jsdom loaded');

                var connection = connect(config.connection);

                addTiming('connected to db');

                execute(connection, config.connection.sql, function (xf) {
                    addTiming('sql query completed');

                    w = window;

                    var body = window.document.getElementsByTagName('body')[0];

                    window.dc.disableTransitions = true;

                    config.charts.forEach(function (chartConfig, chartIndex) {
                        try {
                            // create the div container for the chart
                            var chartContainer = window.document.createElement('div');
                            chartContainer.setAttribute('data-type', chartConfig.type);
                            chartContainer.className = chartContainer.className + ' dc-server-chart';
                            body.appendChild(chartContainer);

                            // parse the options
                            chartConfig.options.dimension = xf.dimension(chartConfig.options.dimension);
                            chartConfig.options.group = chartConfig.options.group(chartConfig.options.dimension);

                            // create and render the chart
                            var chart = window.dc[chartConfig.type](chartContainer);
                            chart.options(chartConfig.options).render();
                            addTiming('chart number ' + (chartIndex + 1) + ' of ' + config.charts.length + ' rendered');
                            charts.push(chart);
                        } catch (err) {
                            console.trace();
                            console.warn(err);
                        }
                    });

                    logTiming();

                    socket.emit('afterRender', body.innerHTML);
                });
            }
        });
    });

    socket.on('filter', function (filter) {
        addTiming('filtering started');
        try {
            var chart = charts[filter[0]];

            if (typeof filter[1] === 'object') {
                if (filter[1][0] === null || filter[1][1] === null) {
                    chart.filter(null);
                } else {
                    var width = chart.effectiveWidth(),
                        domain = chart.x().domain();

                    var range = [
                        filter[1][0] / width * (domain[1] - domain[0]) + domain[0],
                        filter[1][1] / width * (domain[1] - domain[0]) + domain[0]
                    ];

                    range.isFiltered = function (value) {
                        return value >= this[0] && value < this[1];
                    };

                    chart.brush().extent(range);
                    chart.replaceFilter(range);
                }
            } else {
                console.log(filter[1]);
                console.log(chart.group().all()[filter[1]]);
                console.log(chart.keyAccessor()(chart.group().all()[filter[1]]));
                chart.filter(chart.keyAccessor()(chart.group().all()[filter[1]]));
            }

            w.dc.redrawAll();
            socket.emit('afterFilter', w.document.body.innerHTML);
            addTiming('filtering sent');
            logTiming();
        } catch (e) {
            console.log(e);
            socket.emit('afterFilterError', e);
        }
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('Listening on http://127.0.0.1:3000/');
});
