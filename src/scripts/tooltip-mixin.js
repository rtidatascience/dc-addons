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
                        .html(function (d, i, subI) {
                            var title = _chart.title();

                            if (_chart.children) {
                                title = _chart.children()[subI].title();
                            }

                            if (typeof title !== 'function') {
                                title = title[subI];
                            }

                            if (d.data) {
                                return title(d.data);
                            }

                            return title(d);
                        });

                var wrapper = svg.selectAll('g.sub');

                if (wrapper.empty()) {
                    wrapper = svg;
                }

                wrapper.selectAll(selector).call(tip);
                wrapper.selectAll(selector).on('mouseover', tip.show).on('mouseleave', tip.hide);

                // remove standard tooltip
                svg.selectAll('title').remove();
            };

            _chart.tip();
        }

        return _chart;
    };
})();
