/*!
 * dc-addons v0.10.4
 *
 * 2015-09-16 13:22:54
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
