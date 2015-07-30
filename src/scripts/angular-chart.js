(function() {
    'use strict';

    var dcChart = function($timeout) {
        return {
            restrict: 'E',
            scope: {
                chartType: '=',
                chartGroup: '=',
                chartOptions: '='
            },
            link: function($scope, element) {
                $scope.drawChart = function() {
                    if (_.isString($scope.chartType) && _.isObject($scope.chartOptions)) {
                        if (!_.isNull($scope.chart)) {
                            dc.chartRegistry.clear();
                        }

                        $scope.chart = dc[$scope.chartType](element[0], $scope.chartGroup || undefined);

                        if ($scope.chartType === 'compositeChart') {
                            _.forEach($scope.chartOptions.compose, function(c, i) {
                                if (c.chartType && !_.isFunction(c.useRightYAxis)) {
                                    $scope.chartOptions.compose[i] = dc[c.chartType]($scope.chart).options(c);
                                }
                            });
                        }

                        $scope.chart.options($scope.chartOptions);
                        $scope.chart.render();
                        $scope.resize();
                    }
                };

                $scope.resetChart = function() {
                    $scope.chart = null;
                    element.empty();
                };

                $scope.resize = function() {
                    try {
                        if ($scope.chart.data().length > 0) {
                            $scope.chart.root().select('svg').attr('width', '100%');
                            $timeout(function () {
                                if ($scope.chart.hasOwnProperty('rescale')) {
                                    $scope.chart.rescale();
                                }
                                $scope.chart.redraw();
                            }, 100);
                        }
                    } catch (err) {

                    }
                };

                $scope.$watch('chartType', function() {
                    $scope.resetChart();
                    $scope.drawChart();
                });

                $scope.$watch('chartOptions', function() {
                    $scope.resetChart();
                    $scope.drawChart();
                });

                $scope.resetChart();
            }
        };
    };

    dcChart.$inject = ['$timeout'];

    angular.module('AngularDc').directive('dcChart', dcChart);

})();
