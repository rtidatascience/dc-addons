// Code copied and changed from https://github.com/vlandham/gates_bubbles

(function () {
    'use strict';

    dc.bubbleCloud = function (parent, chartGroup) {
        var _chart = dc.bubbleMixin(dc.coordinateGridMixin({}));

        var LAYOUT_GRAVITY = 0.2;
        var RADIUS_TRANSITION = 1500;
        var FRICTION = 0.5;
        var PADDING = 10;

        var _force = null;
        var _circles = [];
        var _g = null;
        var _gs = null;

        _chart._doRender = function () {
            _chart.resetSvg();

            _g = _chart.svg().append('g');

            _circles = [];

            drawChart();

            return _chart;
        };

        _chart._doRedraw = function () {
            drawChart();

            return _chart;
        };

        function drawChart() {
            if (_circles.length === 0) {
                createBubbles();
            } else {
                updateBubbles();
            }

            highlightFilter();

            _force = d3.layout.force()
                .nodes(_chart.data())
                .size([_chart.width(), _chart.height()]);

            _force
                .gravity(LAYOUT_GRAVITY)
                .charge(charge)
                .friction(FRICTION)
                .on('tick', function (e) {
                    _circles
                        .each(moveTowardsCenter(e.alpha))
                        .attr('cx', function (d) {
                            d3.select(this.parentNode).attr('transform', 'translate(' + d.x + ',' + d.y + ')');
                            // return d.x;
                            return 0;
                        })
                        .attr('cy', function (d) {
                            // return d.y;
                            return 0;
                        });
                });

            _force.start();

            setTimeout(function () {
                _force.stop();
            }, 2000);
        }

        function createBubbles() {
            _gs = _g
                .selectAll('g')
                .data(_chart.data())
                .enter()
                .append('g')
                .on('click', _chart.onClick);

            _circles = _gs
                .append('circle')
                .attr('class', 'bubble')
                .attr('r', 0)
                .attr('fill-opacity', 1)
                .attr('fill', function (d, i) {
                    return _chart.getColor(d, i);
                })
                .attr('stroke-width', 2)
                .on('mouseenter', function (d, i) {
                    d3.select(this).attr('stroke', '#303030');
                })
                .on('mouseout', function (d, i) {
                    d3.select(this).attr('stroke', 'none');
                });

            _chart._doRenderLabel(_gs);

            _circles
                .append('title')
                .text(function (d) {
                    if (_chart.renderTitle()) {
                        return _chart.title()(d);
                    }
                });

            _circles.transition().duration(RADIUS_TRANSITION).attr('r', function (d) {
                d.radius = _chart.bubbleR(d);
                d.x = Math.random() * _chart.width();
                d.y = Math.random() * _chart.height();
                return d.radius;
            });
        }

        function updateBubbles() {
            _circles.data(_chart.data())
                .attr('r', function (d) {
                    d.radius = _chart.bubbleR(d);
                    return d.radius;
                });

            _chart.doUpdateLabels(_gs);
        }

        function moveTowardsCenter(alpha) {
            var quadtree = d3.geom.quadtree(_chart.data());

            return function (d) {
                var r = d.radius + d3.max(_chart.data().map(function (d) { return d.radius; })) + PADDING,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;

                quadtree.visit(function (quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius + PADDING;

                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }

                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            };
        }

        function charge(d) {
            return -Math.pow(d.radius, 2.0) / 8;
        }

        function highlightFilter() {
            if (_chart.hasFilter()) {
                _gs.each(function (d) {
                    if (_chart.hasFilter(_chart.keyAccessor()(d))) {
                        _chart.highlightSelected(this);
                    } else {
                        _chart.fadeDeselected(this);
                    }
                });
            } else {
                _gs.each(function () {
                    _chart.resetHighlight(this);
                });
            }
        }

        return _chart.anchor(parent, chartGroup);
    };
})();
