(function () {
    'use strict';

    if (dc.tooltipMixin) {
        return false;
    }

    dc.tooltipMixin = function (_chart) {

        if (_chart) {
            _chart.tip = function () {
                var svg = _chart.svg();
                var wrapper = svg.selectAll('g.sub'); // if the chart has sub grouping (e.g. composite or series)

                // if no sub grouping then just use the chart svg
                if (wrapper.empty()) {
                    wrapper = svg;
                }

                // get all elements that want a tooltip
                var elements = wrapper.selectAll('rect.bar,circle.dot,g.pie-slice path,circle.bubble,g.row rect');

                // nothing to tip so exit
                if (elements.empty()) {
                    return false;
                }

                // create the tip object
                var tip = d3.tip()
                    .attr('class', 'tip')
                    .html(function (d, i, subI) {
                        var title = _chart.title();

                        // if the chart is a composite chart
                        if (_chart.children) {
                            title = _chart.children()[subI].title();
                        }

                        // if the chart is a paired row chart
                        if (typeof title !== 'function') {
                            title = title[subI];
                        }

                        var data = d;
                        if (d.data) {
                            data = d.data;
                        }

                        return title(data);
                    });

                tip.offset([-10, 0]);

                // add the tip to the elements
                elements.call(tip);
                elements.on('mouseover', tip.show).on('mouseleave', tip.hide);

                // remove standard tooltip
                svg.selectAll('title').remove();
            };

            _chart.tip();
        }

        return _chart;
    };
})();
