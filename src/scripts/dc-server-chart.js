(function () {
    'use strict';

    if (!('dc' in window)) {
        window.dc = {};
    }

    dc.serverChart = function (parent, chartGroup) {
        var _chart = {},
            socket = null,
            element = d3.select(parent),
            _options = {
                server: 'http://127.0.0.1:3000/',
                error_message: '<div class="alert alert-danger">A problem occured creating the charts. Please try again later</div>',
                loading_message: '<i class="fa fa-refresh fa-spin"></i>',
            },
            mouse_down_coords = null,
            east = null,
            west = null,
            prev_east = null,
            prev_west = null,
            extent_mouse = false,
            resize_east_mouse = false,
            resize_west_mouse = false;

        //---------------------
        // Redraw Functions
        //---------------------

        function redraw (response) {
            var next = document.createElement('div');
            next.innerHTML = response;
            next = d3.select(next);

            element.selectAll('.dc-chart').each(function(el, chartIndex) {
                var chartWrapper = d3.select(this),
                    nextWrapper = next.selectAll('.dc-chart').filter(function(d, j) {
                        return j === chartIndex;
                    }),
                    chartType = getChartType(chartWrapper);

                if (typeof dc.serverChart['redraw' + chartType] === 'function') {
                    dc.serverChart['redraw' + chartType](chartIndex, chartWrapper, nextWrapper);
                } else {
                    chartWrapper.html(nextWrapper.html());
                    attachEvents();
                }
            });
        };

        //---------------------
        // Browser Events
        //---------------------

        function attachEvents () {
            element.selectAll('.dc-chart').each(function(chartData, chartIndex) {
                var chartWrapper = d3.select(this),
                    chartType = getChartType(chartWrapper);

                if (typeof dc.serverChart['attachEvents' + chartType] === 'function') {
                    dc.serverChart['attachEvents' + chartType](chartIndex, chartWrapper);
                }
            });
        };

        dc.serverChart.attachEventsBarChart  = function (chartIndex, chartWrapper) {
            chartWrapper
                .selectAll('rect.bar')
                .on('click', function(barData, barIndex) {
                    sendFilter(chartIndex, barIndex);
                });

            attachEventsBrush(chartIndex, chartWrapper);
        };

        dc.serverChart.attachEventsPieChart = function (chartIndex, chartWrapper) {
            chartWrapper
                .selectAll('g.pie-slice')
                .on('click', function(sliceData, sliceIndex) {
                    sendFilter(chartIndex, sliceIndex);
                });
        };

        dc.serverChart.attachEventsRowChart = function (chartIndex, chartWrapper) {
            chartWrapper
                .selectAll('g.row')
                .selectAll('rect')
                .on('click', function(rowData, rowIndex, gIndex) {
                    sendFilter(chartIndex, gIndex);
                });
        };

        dc.serverChart.attachEventsLineChart = function (chartIndex, chartWrapper) {
            chartWrapper
                .selectAll('circle.dot')
                .on('mousemove', function () {
                    var dot = d3.select(this);
                    dot.style('fill-opacity', 0.8);
                    dot.style('stroke-opacity', 0.8);
                })
                .on('mouseout', function () {
                    var dot = d3.select(this);
                    dot.style('fill-opacity', 0.01);
                    dot.style('stroke-opacity', 0.01);
                });

            attachEventsBrush(chartIndex, chartWrapper);
        };

        function attachEventsBrush(chartIndex, chartWrapper) {
            var max_east = chartWrapper
                .select('g.brush')
                .select('.background')
                .attr('width');

            chartWrapper
                .select('g.brush')
                .on('mousedown', function() {
                    mouse_down_coords = d3.mouse(this);
                    prev_west = west;
                    prev_east = east;
                })
                .on('mousemove', function() {
                    if (mouse_down_coords !== null) {
                        var coords = d3.mouse(this),
                            el = d3.select(this);

                        if (extent_mouse) {
                            var diff = coords[0] - mouse_down_coords[0];

                            west = prev_west + diff;
                            east = prev_east + diff;

                            if (west < 0) {
                                west = 0;
                                east = prev_east - prev_west;
                            }

                            if (east > max_east) {
                                east = max_east;
                                west = max_east - (prev_east - prev_west);
                            }

                        } else if (resize_east_mouse) {
                            west = west;
                            east = coords[0];

                            if (east < west) {
                                var tmp = west;
                                west = east;
                                east = tmp;
                                resize_east_mouse = false;
                                resize_west_mouse = true;
                            }

                            if (west < 0) {
                                west = 0;
                            }

                            if (east > max_east) {
                                east = max_east;
                            }
                        } else if (resize_west_mouse) {
                            west = coords[0];
                            east = east;

                            if (east < west) {
                                var tmp = west;
                                west = east;
                                east = tmp;
                                resize_east_mouse = true;
                                resize_west_mouse = false;
                            }

                            if (west < 0) {
                                west = 0;
                            }

                            if (east > max_east) {
                                east = max_east;
                            }
                        } else {
                            west = d3.min([coords[0], mouse_down_coords[0]]);
                            east = d3.max([coords[0], mouse_down_coords[0]]);

                            if (west < 0) {
                                west = 0;
                            }

                            if (east > max_east) {
                                east = max_east;
                            }
                        }

                        el
                            .select('.extent')
                            .attr('x', west)
                            .attr('width', east - west);

                        el
                            .selectAll('g.resize')
                            .style('display', 'inline');

                        el
                            .select('g.resize.e')
                            .attr('transform', 'translate(' + east + ', 0)');

                        el
                            .select('g.resize.w')
                            .attr('transform', 'translate(' + west + ', 0)');
                    }
                })
                .on('mouseup', function() {
                    var coords = d3.mouse(this),
                        el = d3.select(this);

                    if (mouse_down_coords === null || coords[0] === mouse_down_coords[0]) {
                        el
                            .select('.extent')
                            .attr('width', 0);

                        el
                            .selectAll('g.resize')
                            .style('display', 'none');

                        sendFilter(chartIndex, [null, null]);
                    } else {
                        // somehow calculate what was selected
                        sendFilter(chartIndex, [west, east]);
                    }

                    mouse_down_coords = null;
                })

            chartWrapper
                .select('g.brush')
                .select('.extent')
                .on('mousedown', function() {
                    extent_mouse = true;
                })
                .on('mouseup', function() {
                    extent_mouse = false;
                });

            chartWrapper
                .select('g.brush')
                .select('g.resize.e')
                .on('mousedown', function() {
                    resize_east_mouse = true;
                })
                .on('mouseup', function() {
                    resize_east_mouse = false;
                });

            chartWrapper
                .select('g.brush')
                .select('g.resize.w')
                .on('mousedown', function() {
                    resize_west_mouse = true;
                })
                .on('mouseup', function() {
                    resize_west_mouse = false;
                });
        }

        //---------------------
        // Chart Events
        //---------------------

        _chart.render = function() {
            sendRender();
            return _chart;
        };

        _chart.options = function(_) {
            if (arguments.length === 0) {
                return _options;
            }

            for(var key in _) {
                if (_.hasOwnProperty(key)) {
                    _options[key] = _[key];
                }
            }
            return _chart;
        };

        //---------------------
        // Socket Events
        //---------------------

        function sendFilter (chartIndex, index) {
            socket.emit('filter', [chartIndex, index]);
        };

        function sendRender () {
            onRefresh();
            socket.emit('render', chartGroup);
        };

        function render (response) {
            element.html(response);
            attachEvents();
        };

        function renderError (response) {
            element.html(_options.error_message);
            console.warn(response);
        };

        //---------------------
        // Helper Functions
        //---------------------
        function onRefresh () {
            element.html(_options.loading_message);
        };

        function init () {
            socket = io(_options.server);
            socket.on('afterRender', render);
            socket.on('afterRenderError', renderError);
            socket.on('afterFilter', redraw);
            socket.on('afterFilterError', renderError);
        };

        function getChartType (chartWrapper) {
            var chartType = chartWrapper.attr('data-type').split('');

            chartType[0] = chartType[0].toUpperCase();
            chartType = chartType.join('');

            return chartType;
        };

        //---------------------
        // Init
        //---------------------
        onRefresh();
        init();

        return _chart;
    };

})();
