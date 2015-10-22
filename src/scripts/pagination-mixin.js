(function () {
    'use strict';

    if (dc.paginationMixin) {
        return false;
    }

    dc.paginationMixin = function (_chart) {

        if (_chart) {
            _chart.pagination = {};
            // data information
            _chart.pagination.all_data = _chart.group().all();
            // page information
            _chart.pagination.current_page = 1;
            _chart.pagination.page_size = 5;
            _chart.pagination.page_count = Math.ceil(_chart.pagination.all_data.length / _chart.pagination.page_size);
            // page controls
            _chart.pagination.setPage = function(page) {
                if (page < 1) {
                    page = 1;
                }

                if (page > _chart.pagination.page_count) {
                    page = _chart.pagination.page_count;
                }

                if (page !== _chart.pagination.current_page) {
                    _chart.pagination.current_page = page;
                    _chart.redraw();
                }
            };
            _chart.pagination.previous = function() {
                _chart.pagination.setPage(_chart.pagination.current_page - 1);
            };
            _chart.pagination.next = function() {
                _chart.pagination.setPage(_chart.pagination.current_page + 1);
            };
            _chart.pagination.first = function() {
                _chart.pagination.setPage(1);
            };
            _chart.pagination.last = function() {
                _chart.pagination.setPage(_chart.pagination.page_count);
            };

            _chart.group().all = function() {
                return _chart.pagination.all_data.slice((_chart.pagination.current_page - 1) * _chart.pagination.page_size, _chart.pagination.current_page * _chart.pagination.page_size);
            };
        }

        _chart.redraw();

        return _chart;
    };
})();
