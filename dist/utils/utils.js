/*!
 * dc-addons v0.10.2
 *
 * 2015-08-20 16:06:36
 *
 */
dc.utils.getAllFilters = function () {
    var result = {};
    var list = dc.chartRegistry.list();

    for (var e in list) {
        var chart = list[e];
        result[chart.chartID()] = chart.filters();
    }

    return result;
};
