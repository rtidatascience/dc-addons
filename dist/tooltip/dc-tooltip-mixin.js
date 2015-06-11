/*!
 * dc-addons v0.7.1
 *
 * 2015-06-11 10:34:14
 *
 */
(function () {
    'use strict';

    dc.tooltipMixin = function (_chart) {

        if (_chart) {
            _chart.tip = function () {
                var selector = 'rect.bar,circle.dot,g.pie-slice path,circle.bubble,g.row rect',
                    svg = _chart.svg(),
                    tip = d3.tip()
                        .attr('class', 'tip')
                        .html(function (d) {
                            if (d.data) {
                                return _chart.title()(d.data);
                            }

                            return _chart.title()(d);
                        });

                svg.selectAll(selector).call(tip);
                svg.selectAll(selector).on('mouseover', tip.show).on('mouseleave', tip.hide);

                // remove standard tooltip
                svg.selectAll('title').remove();
            };

            _chart.tip();
        }

        return _chart;
    };
})();
