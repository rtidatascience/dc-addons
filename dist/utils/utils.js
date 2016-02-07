/*!
 * dc-addons v0.11.5
 *
 * 2016-02-08 09:21:40
 *
 */
if (!dc.utils.getAllFilters) {
    dc.utils.getAllFilters = function () {
        var result = {};
        var list = dc.chartRegistry.list();

        for (var e in list) {
            var chart = list[e];
            result[chart.chartID()] = chart.filters();
        }

        return result;
    };
}
