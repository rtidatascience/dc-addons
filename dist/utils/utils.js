/*!
 * dc-addons v0.10.3
 *
 * 2015-08-26 14:19:42
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
