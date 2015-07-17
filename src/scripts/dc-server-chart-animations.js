(function () {
    'use strict';

    dc.serverChart.redrawPieChart = function (chartIndex, chartWrapper, nextWrapper) {
        var svg = chartWrapper.select('svg'),
            currentSlices = chartWrapper.selectAll('g.pie-slice'),
            nextSlices = nextWrapper.selectAll('g.pie-slice');

        chartWrapper
            .selectAll('text')
            .each(function(d, i) {
                var nextText = filterNextItem(nextWrapper.selectAll('text'), i);

                d3
                    .select(this)
                    .text(nextText.text())
                    .transition()
                        .duration(350)
                        .ease('linear')
                        .attr('transform', nextText.attr('transform'));
            });


        currentSlices
            .attr('class', function(d, i) {
                return filterNextItem(nextSlices, i)
                    .attr('class');
            });

        currentSlices
            .select('title')
            .text(function(d, i) {
                return filterNextItem(nextSlices, i)
                    .select('title')
                    .text();
            });

        currentSlices
            .select('path')
            .transition()
                .duration(350)
                .ease('linear')
                .attrTween('d', function (d, i, a) {
                    var radius = d3.min([svg.attr('width'), svg.attr('height')]) / 2,
                        arc = d3.svg.arc().outerRadius(radius).innerRadius(0),
                        next_d = filterNextItem(nextSlices, i)
                            .select('path')
                            .attr('d'),
                        interpolate = d3.interpolate(pathToInterpolateAngles(a), pathToInterpolateAngles(next_d));

                    function pathToInterpolateAngles(path) {
                        // get the points of the pie slice
                        var p = path.match(/M ?([\d\.e-]+) ?, ?([\d\.e-]+) ?A ?[\d\.e-]+ ?, ?[\d\.e-]+ ?,? \d ,? ?\d ?,? ?\d ?,? ?([\d\.e-]+) ?,? ?([\d\.e-]+) ?L ?([\d\.e-]+) ?,? ?([\d\.e-]+)Z/);

                        if (!p) {
                            return {
                                startAngle: 0,
                                endAngle: 0,
                            };
                        }

                        var coords = {
                            x1: parseFloat(p[5]),
                            y1: parseFloat(p[6]),
                            x2: parseFloat(p[1]),
                            y2: parseFloat(p[2]),
                            x3: parseFloat(p[3]),
                            y3: parseFloat(p[4]),
                        };

                        // convert the points into angles
                        var angles = {
                            startAngle: switchRadians(Math.atan2((coords.y2 - coords.y1), (coords.x2 - coords.x1))),
                            endAngle:   switchRadians(Math.atan2((coords.y3 - coords.y1), (coords.x3 - coords.x1))),
                        };

                        if (angles.startAngle < 0) {
                            angles.startAngle = 0;
                        }

                        if (angles.endAngle > (Math.PI * 2) || angles.endAngle < angles.startAngle) {
                            angles.endAngle = Math.PI * 2;
                        }

                        return angles;
                    }

                    // since silly maths makes the following angles we have to convert it from
                    //      -90               -(PI / 2)
                    // -180     0   or    -PI             0
                    //       90                  PI / 2
                    //
                    // to
                    //     360                   PI * 2
                    // 270     90   or    PI * 1.5     PI / 2
                    //     180                      PI
                    function switchRadians(angle) {
                        var quarter     = Math.PI * 0.5;

                        if (angle >= 0) {
                            return quarter + angle;
                        } else if (angle >= -quarter) {
                            return quarter - Math.abs(angle);
                        }

                        return (Math.PI * 2.5) - Math.abs(angle);
                    }


                    return function (t) {
                        return arc(interpolate(t));
                    };
                });
    };

    dc.serverChart.redrawBarChart = function (chartIndex, chartWrapper, nextWrapper) {
        var currentBars = chartWrapper.selectAll('rect.bar'),
            nextBars = nextWrapper.selectAll('rect.bar');

        currentBars
            .attr('class', function(d, i) {
                return filterNextItem(nextBars, i)
                    .attr('class');
            })
            .attr('fill', function(d, i) {
                return filterNextItem(nextBars, i)
                    .attr('fill');
            })
            .transition()
                .duration(350)
                .ease('linear')
                .attr('x', function(d, i) {
                    return filterNextItem(nextBars, i)
                        .attr('x');
                })
                .attr('y', function(d, i) {
                    return filterNextItem(nextBars, i)
                        .attr('y');
                })
                .attr('width', function(d, i) {
                    return filterNextItem(nextBars, i)
                        .attr('width');
                })
                .attr('height', function(d, i) {
                    return filterNextItem(nextBars, i)
                        .attr('height');
                });

        currentBars
            .select('title')
            .text(function(d, i) {
                return filterNextItem(nextBars, i)
                    .select('title')
                    .text();
            });

        redrawAxis(chartIndex, chartWrapper, nextWrapper);
        redrawGridLine(chartIndex, chartWrapper, nextWrapper);
    };

    dc.serverChart.redrawRowChart = function (chartIndex, chartWrapper, nextWrapper) {
        chartWrapper
            .selectAll('g.row')
            .each(function(d, i) {
                var row = d3.select(this),
                    nextRow = filterNextItem(nextWrapper.selectAll('g.row'), i),
                    nextRect = nextRow.select('rect'),
                    nextText = nextRow.select('text'),
                    nextTitle = nextRow.select('title');

                row.transition()
                    .duration(350)
                    .ease('linear')
                    .attr('transform', nextRow.attr('transform'));

                row
                    .select('rect')
                    .attr('class', nextRect.attr('class'))
                    .transition()
                        .duration(350)
                        .ease('linear')
                        .attr('width', nextRect.attr('width'))
                        .attr('height', nextRect.attr('height'))
                        .attr('fill', nextRect.attr('fill'))
                        .attr('transform', nextRect.attr('transform'));

                row
                    .select('text')
                    .text(nextText.text())
                    .transition()
                        .duration(350)
                        .ease('linear')
                        .attr('x', nextText.attr('x'))
                        .attr('y', nextText.attr('y'))
                        .attr('dy', nextText.attr('dy'))
                        .attr('transform', nextText.attr('transform'));

                row
                    .select('title')
                    .text(nextTitle.text());
            })


        redrawAxis(chartIndex, chartWrapper, nextWrapper);
    };

    function redrawAxis (chartIndex, chartWrapper, nextWrapper) {
        chartWrapper
            .selectAll('.axis')
            .each(function(d, axisIndex) {
                var el = d3.select(this),
                    nextAxis = filterNextItem(nextWrapper.selectAll('.axis'), axisIndex);

                el.transition()
                    .duration(350)
                    .ease('linear')
                    .attr('transform', nextAxis.attr('transform'));
            })
            .selectAll('g.tick')
            .each(function(d, i, axisIndex) {
                var el = d3.select(this),
                    nextTick = filterNextItem(filterNextItem(nextWrapper.selectAll('.axis'), axisIndex).selectAll('g.tick'), i);

                if (nextTick[0].length > 0) {
                    el
                        .transition()
                            .duration(350)
                            .ease('linear')
                            .attr('transform', nextTick.attr('transform'))
                            .attr('opacity', nextTick.attr('opacity'));

                    el
                        .select('text')
                        .text(nextTick.select('text').text());
                } else {
                    el.remove();
                }
            });

        nextWrapper
            .selectAll('.axis')
            .selectAll('g.tick')
            .each(function(d, i, gridLineIndex) {
                var el = d3.select(this),
                    currentGrid = filterNextItem(chartWrapper.selectAll('.axis'), gridLineIndex),
                    currentGridLine = filterNextItem(currentGrid.selectAll('g.tick'), i);

                if (currentGridLine[0].length === 0) {
                    var nextTick = currentGrid
                        .append('g')
                        .attr('class', 'tick')
                        .attr('opacity', el.attr('opacity'))
                        .attr('transform', el.attr('transform'));

                    var nextLine = el.select('line');
                    nextTick
                        .append('line')
                        .attr('x2', nextLine.attr('x2'))
                        .attr('y2', nextLine.attr('y2'));

                    var nextText = el.select('text');
                    nextTick
                        .append('text')
                        .attr('x', nextText.attr('x'))
                        .attr('y', nextText.attr('y'))
                        .attr('dy', nextText.attr('dy'))
                        .attr('style', nextText.attr('style'))
                        .text(nextText.text());

                    // some charts have the grid line inside the tick (i.e. a row chart but not a bar chart)
                    var nextGridLine = el.select('line.grid-line');

                    if (nextGridLine[0].length > 0 && nextGridLine[0][0]) {
                        nextTick
                            .append('line')
                            .attr('class', 'grid-line')
                            .attr('x1', nextGridLine.attr('x1'))
                            .attr('y1', nextGridLine.attr('y1'))
                            .attr('x2', nextGridLine.attr('x2'))
                            .attr('y2', nextGridLine.attr('y2'));
                    }
                }
            });
    };

    function redrawGridLine (chartIndex, chartWrapper, nextWrapper) {
        chartWrapper
            .selectAll('g.grid-line')
            .each(function(d, i) {
                var el = d3.select(this),
                    nextGridLine = filterNextItem(nextWrapper.selectAll('.grid-line'), i);

                el.transition()
                    .duration(350)
                    .ease('linear')
                    .attr('transform', nextGridLine.attr('transform'));
            })
            .selectAll('line')
            .each(function(d, i, gridLineIndex) {
                var el = d3.select(this),
                    nextGridLine = filterNextItem(filterNextItem(nextWrapper.selectAll('.grid-line'), gridLineIndex).selectAll('line'), i);

                if (nextGridLine[0].length > 0) {
                    el
                        .transition()
                            .duration(350)
                            .ease('linear')
                            .attr('x1', nextGridLine.attr('x1'))
                            .attr('y1', nextGridLine.attr('y1'))
                            .attr('x2', nextGridLine.attr('x2'))
                            .attr('y2', nextGridLine.attr('y2'))
                            .attr('opacity', nextGridLine.attr('opacity'));
                } else {
                    el.remove();
                }
            });

        nextWrapper
            .selectAll('g.grid-line')
            .selectAll('line')
            .each(function(d, i, gridLineIndex) {
                var el = d3.select(this),
                    currentGrid = filterNextItem(chartWrapper.selectAll('.grid-line'), gridLineIndex),
                    currentGridLine = filterNextItem(currentGrid.selectAll('line'), i);

                if (currentGridLine[0].length === 0) {
                    currentGrid
                        .append('line')
                        .attr('x1', el.attr('x1'))
                        .attr('y1', el.attr('y1'))
                        .attr('x2', el.attr('x2'))
                        .attr('y2', el.attr('y2'))
                        .attr('opacity', el.attr('opacity'));
                }
            });
    }

    function filterNextItem (next, i) {
        return next.filter(function(d, j) {
            return j === i;
        });
    }
})();
