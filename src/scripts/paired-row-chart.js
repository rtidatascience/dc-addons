(function () {
    'use strict';

    dc.pairedRowChart = function (parent, chartGroup) {
        var _chart = dc.capMixin(dc.marginMixin(dc.colorMixin(dc.baseMixin({}))));

        var _leftChartWrapper = d3.select(parent).append('div');
        var _rightChartWrapper = d3.select(parent).append('div').style('border-left', '1px solid #000000');

        var _leftChart = dc.rowChart(_leftChartWrapper[0][0], chartGroup);
        var _rightChart = dc.rowChart(_rightChartWrapper[0][0], chartGroup);

        // on redraw and render pass onto child charts
        _chart._doRedraw = function () {
            _leftChart._doRedraw();
            _rightChart._doRedraw();
            return _chart;
        };

        _chart._doRender = function () {
            _leftChart._doRender();
            _rightChart._doRender();
            return _chart;
        };

        // data filtering

        var _leftKeyFilter = function (d) {
            return d.key[0];
        };

        var _rightKeyFilter = function (d) {
            return d.key[0];
        };

        _leftChart.data(function (data) {
            var cap = _leftChart.cap(),
                d = data.all().filter(function (d) {
                return _chart.leftKeyFilter()(d);
            });

            if (cap === Infinity) {
                return d;
            }

            return d.slice(0, cap);
        });

        _rightChart.data(function (data) {
            var cap = _rightChart.cap(),
                d = data.all().filter(function (d) {
                return _chart.rightKeyFilter()(d);
            });

            if (cap === Infinity) {
                return d;
            }

            return d.slice(0, cap);
        });

        _chart.leftKeyFilter = function (_) {
            if (!arguments.length) {
                return _leftKeyFilter;
            }

            _leftKeyFilter = _;
            return _chart;
        };

        _chart.rightKeyFilter = function (_) {
            if (!arguments.length) {
                return _rightKeyFilter;
            }

            _rightKeyFilter = _;
            return _chart;
        };

        // chart filtering

        _leftChart.onClick = function (d) {
            var filter = _leftChart.keyAccessor()(d);
            dc.events.trigger(function () {
                _leftChart.filter(filter);
                _rightChart.filter(filter);
                _leftChart.redrawGroup();
            });
        };

        _rightChart.onClick = function (d) {
            var filter = _rightChart.keyAccessor()(d);
            dc.events.trigger(function () {
                _rightChart.filter(filter);
                _leftChart.filter(filter);
                _rightChart.redrawGroup();
            });
        };

        // margins
        var _margins = _chart.margins();

        _chart.margins = function (_) {
            if (!arguments.length) {
                return _margins;
            }
            _margins = _;

            // set left chart margins
            _leftChart.margins({
                top: _.top,
                right: 0,
                bottom: _.bottom,
                left: _.left,
            });

            // set right chart margins
            _rightChart.margins({
                top: _.top,
                right: _.right,
                bottom: _.bottom,
                left: 0,
            });

            return _chart;
        };

        _chart.margins(_margins);
        _leftChart.useRightYAxis(true);

        // svg

        _chart.svg = function () {
            return d3.selectAll([_leftChart.svg()[0][0], _rightChart.svg()[0][0]]);
        };

        // domain

        _chart.group = function (_) {
            if (!arguments.length) {
                return _leftChart.group();
            }
            _leftChart.group(_);
            _rightChart.group(_);

            // set the new x axis scale
            var extent = d3.extent(_.all(), _chart.cappedValueAccessor);
            if (extent[0] > 0) {
                extent[0] = 0;
            }
            _leftChart.x(d3.scale.linear().domain(extent).range([_leftChart.effectiveWidth(), 0]));
            _rightChart.x(d3.scale.linear().domain(extent).range([0, _rightChart.effectiveWidth()]));

            return _chart;
        };

        // functions that you just want to pass on to both sub charts
        var _getterSetterPassOn = [
            // display
            'height', 'width', 'minHeight', 'minWidth', 'renderTitleLabel', 'fixedBarHeight', 'gap', 'othersLabel',
            'transitionDuration', 'label', 'renderLabel', 'title', 'renderTitle', 'chartGroup',
            //colors
            'colors', 'ordinalColors', 'linearColors', 'colorAccessor', 'colorDomain', 'getColor', 'colorCalculator',
            // x axis
            'x', 'elasticX', 'valueAccessor', 'labelOffsetX', 'titleLabelOffsetx',
            // y axis
            'keyAccessor', 'labelOffsetY',
            // data
            'cap', 'ordering' , 'dimension', 'othersGrouper', 'data'
        ];

        function addGetterSetterFunction(functionName) {
            _chart[functionName] = function (_) {
                if (!arguments.length) {
                    return _leftChart[functionName]();
                }
                _leftChart[functionName](_);
                _rightChart[functionName](_);
                return _chart;
            };
        }

        for (var i = 0; i < _getterSetterPassOn.length; i++) {
            addGetterSetterFunction(_getterSetterPassOn[i]);
        }

        var _passOnFunctions = [
            'render', 'redraw', 'calculateColorDomain', 'filterAll', 'resetSvg', 'expireCache'
        ];

        function addPassOnFunctions(functionName) {
            _chart[functionName] = function () {
                _leftChart[functionName]();
                _rightChart[functionName]();
                return _chart;
            };
        }

        for (i = 0; i < _passOnFunctions.length; i++) {
            addPassOnFunctions(_passOnFunctions[i]);
        }

        return _chart.anchor(parent, chartGroup);
    };

})();
