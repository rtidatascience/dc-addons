/*!
 * dc-addons v0.8.1
 *
 * 2015-07-28 08:20:39
 *
 */
(function () {
    'use strict';

    dc.pairedRowChart = function (parent, chartGroup) {
        var _chart = dc.capMixin(dc.marginMixin(dc.colorMixin(dc.baseMixin({}))));

        var _leftChartWrapper = d3.select(parent).append('div');
        var _rightChartWrapper = d3.select(parent).append('div');

        var _leftChart = dc.rowChart(_leftChartWrapper[0][0], chartGroup);
        var _rightChart = dc.rowChart(_rightChartWrapper[0][0], chartGroup);

        _leftChart.useRightYAxis(true);

        // data filtering

        // we need a way to know which data belongs on the left chart and which data belongs on the right
        var _leftKeyFilter = function (d) {
            return d.key[0];
        };

        var _rightKeyFilter = function (d) {
            return d.key[0];
        };

        /**
        #### .leftKeyFilter([value]) - **mandatory**
        Set or get the left key filter attribute of a chart.

        For example
        function (d) {
            return d.key[0] === 'Male';
        }

        If a value is given, then it will be used as the new left key filter. If no value is specified then
        the current left key filter will be returned.

        **/
        _chart.leftKeyFilter = function (_) {
            if (!arguments.length) {
                return _leftKeyFilter;
            }

            _leftKeyFilter = _;
            return _chart;
        };

        /**
        #### .rightKeyFilter([value]) - **mandatory**
        Set or get the right key filter attribute of a chart.

        For example
        function (d) {
            return d.key[0] === 'Female';
        }

        If a value is given, then it will be used as the new right key filter. If no value is specified then
        the current right key filter will be returned.

        **/
        _chart.rightKeyFilter = function (_) {
            if (!arguments.length) {
                return _rightKeyFilter;
            }

            _rightKeyFilter = _;
            return _chart;
        };

        // when trying to get the data for the left chart then filter all data using the leftKeyFilter function
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

        // when trying to get the data for the right chart then filter all data using the rightKeyFilter function
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

        // chart filtering
        // on clicking either chart then filter both

        _leftChart.onClick = _rightChart.onClick = function (d) {
            var filter = _leftChart.keyAccessor()(d);
            dc.events.trigger(function () {
                _leftChart.filter(filter);
                _rightChart.filter(filter);
                _leftChart.redrawGroup();
            });
        };

        // margins
        // the margins between the charts need to be set to 0 so that they sit together

        var _margins = _chart.margins(); // get the default margins

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

        _chart.margins(_margins); // set the new margins

        // svg
        // return an array of both the sub chart svgs

        _chart.svg = function () {
            return d3.selectAll([_leftChart.svg()[0][0], _rightChart.svg()[0][0]]);
        };

        // data
        // we need to make sure that the extent is the same for both charts

        // this way we need a new function that is overridable
        if (_leftChart.calculateAxisScaleData) {
            _leftChart.calculateAxisScaleData = _rightChart.calculateAxisScaleData = function () {
                return _leftChart.data().concat(_rightChart.data());
            };
        // this way we can use the current dc.js library but we can't use elasticX
        } else {
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
        }

        // functions that we just want to pass on to both sub charts

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
            'cap', 'ordering' , 'dimension', 'group', 'othersGrouper', 'data'
        ];

        function addGetterSetterfunction (functionName) {
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
            addGetterSetterfunction (_getterSetterPassOn[i]);
        }

        var _passOnFunctions = [
            '_doRedraw', 'redraw', '_doRender', 'render', 'calculateColorDomain', 'filterAll', 'resetSvg', 'expireCache'
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
