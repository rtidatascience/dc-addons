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
                errorMessage:
                    '<div class="alert alert-danger">' +
                        'A problem occured creating the charts. Please try again later' +
                    '</div>',
                loadingMessage: '<i class="fa fa-refresh fa-spin"></i>',
            },
            mouseDownCoords = null,
            east = null,
            west = null,
            prevEast = null,
            prevWest = null,
            extentMouse = false,
            resizeEastMouse = false,
            resizeWestMouse = false;

        //---------------------
        // Redraw Functions
        //---------------------

        function redraw (response) {
            var next = document.createElement('div');
            next.innerHTML = response;
            next = d3.select(next);

            element.selectAll('.dc-chart').each(function (el, chartIndex) {
                var chartWrapper = d3.select(this),
                    nextWrapper = next.selectAll('.dc-chart').filter(function (d, j) {
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
        }

        //---------------------
        // Browser Events
        //---------------------

        function attachEvents () {
            element.selectAll('.dc-chart').each(function (chartData, chartIndex) {
                var chartWrapper = d3.select(this),
                    chartType = getChartType(chartWrapper);

                if (typeof dc.serverChart['attachEvents' + chartType] === 'function') {
                    dc.serverChart['attachEvents' + chartType](chartIndex, chartWrapper);
                }
            });
        }

        dc.serverChart.attachEventsBarChart  = function (chartIndex, chartWrapper) {
            chartWrapper
                .selectAll('rect.bar')
                .on('click', function (barData, barIndex) {
                    sendFilter(chartIndex, barIndex);
                });

            attachEventsBrush(chartIndex, chartWrapper);
        };

        dc.serverChart.attachEventsPieChart = function (chartIndex, chartWrapper) {
            chartWrapper
                .selectAll('g.pie-slice')
                .on('click', function (sliceData, sliceIndex) {
                    sendFilter(chartIndex, sliceIndex);
                });
        };

        dc.serverChart.attachEventsRowChart = function (chartIndex, chartWrapper) {
            chartWrapper
                .selectAll('g.row')
                .selectAll('rect')
                .on('click', function (rowData, rowIndex, gIndex) {
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
            if (chartWrapper.select('g.brush').size() > 0) {
                var maxEast = chartWrapper
                    .select('g.brush')
                    .select('.background')
                    .attr('width');

                chartWrapper
                    .select('g.brush')
                    .on('mousedown', function () {
                        mouseDownCoords = d3.mouse(this);
                        prevWest = west;
                        prevEast = east;
                    })
                    .on('mousemove', function () {
                        if (mouseDownCoords !== null) {
                            var coords = d3.mouse(this),
                                el = d3.select(this),
                                tmp = null;

                            if (extentMouse) {
                                var diff = coords[0] - mouseDownCoords[0];

                                west = prevWest + diff;
                                east = prevEast + diff;

                                if (west < 0) {
                                    west = 0;
                                    east = prevEast - prevWest;
                                }

                                if (east > maxEast) {
                                    east = maxEast;
                                    west = maxEast - (prevEast - prevWest);
                                }

                            } else if (resizeEastMouse) {
                                west = west;
                                east = coords[0];

                                if (east < west) {
                                    tmp = west;
                                    west = east;
                                    east = tmp;
                                    resizeEastMouse = false;
                                    resizeWestMouse = true;
                                }

                                if (west < 0) {
                                    west = 0;
                                }

                                if (east > maxEast) {
                                    east = maxEast;
                                }
                            } else if (resizeWestMouse) {
                                west = coords[0];
                                east = east;

                                if (east < west) {
                                    tmp = west;
                                    west = east;
                                    east = tmp;
                                    resizeEastMouse = true;
                                    resizeWestMouse = false;
                                }

                                if (west < 0) {
                                    west = 0;
                                }

                                if (east > maxEast) {
                                    east = maxEast;
                                }
                            } else {
                                west = d3.min([coords[0], mouseDownCoords[0]]);
                                east = d3.max([coords[0], mouseDownCoords[0]]);

                                if (west < 0) {
                                    west = 0;
                                }

                                if (east > maxEast) {
                                    east = maxEast;
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
                    .on('mouseup', function () {
                        var coords = d3.mouse(this),
                            el = d3.select(this);

                        if (mouseDownCoords === null || coords[0] === mouseDownCoords[0]) {
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

                        mouseDownCoords = null;
                    });

                chartWrapper
                    .select('g.brush')
                    .select('.extent')
                    .on('mousedown', function () {
                        extentMouse = true;
                    })
                    .on('mouseup', function () {
                        extentMouse = false;
                    });

                chartWrapper
                    .select('g.brush')
                    .select('g.resize.e')
                    .on('mousedown', function () {
                        resizeEastMouse = true;
                    })
                    .on('mouseup', function () {
                        resizeEastMouse = false;
                    });

                chartWrapper
                    .select('g.brush')
                    .select('g.resize.w')
                    .on('mousedown', function () {
                        resizeWestMouse = true;
                    })
                    .on('mouseup', function () {
                        resizeWestMouse = false;
                    });
            }
        }

        //---------------------
        // Chart Events
        //---------------------

        _chart.render = function () {
            sendRender();
            return _chart;
        };

        _chart.options = function (_) {
            if (arguments.length === 0) {
                return _options;
            }

            for (var key in _) {
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
        }

        function sendRender () {
            onRefresh();
            socket.emit('render', chartGroup);
        }

        function render (response) {
            element.html(response);
            attachEvents();
        }

        function renderError (response) {
            element.html(_options.errorMessage);
            console.warn(response);
        }

        //---------------------
        // Helper Functions
        //---------------------
        function onRefresh () {
            element.html(_options.loadingMessage);
        }

        function init () {
            socket = io(_options.server);
            socket.on('afterRender', render);
            socket.on('afterRenderError', renderError);
            socket.on('afterFilter', redraw);
            socket.on('afterFilterError', renderError);
        }

        function getChartType (chartWrapper) {
            var chartType = chartWrapper.attr('data-type').split('');

            chartType[0] = chartType[0].toUpperCase();
            chartType = chartType.join('');

            return chartType;
        }

        //---------------------
        // Init
        //---------------------
        onRefresh();
        init();

        return _chart;
    };

})();
