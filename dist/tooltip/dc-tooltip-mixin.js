/*!
 * dc-addons v0.11.1
 *
 * 2015-10-23 10:14:02
 *
 */
(function () {
    'use strict';

    if (dc.tooltipMixin) {
        return false;
    }

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
