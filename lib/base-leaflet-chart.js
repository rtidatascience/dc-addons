dc.baseLeafletChart = function(_chart) {
    _chart = dc.baseChart(_chart);

    var _map;

    var _renderPopup = true;
    var _mapOptions = false;
    var _defaultCenter = false;
    var _defaultZoom = false;

    var _tiles = function(map) {
        L.tileLayer(
            'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }
        ).addTo(map);
    };

    var _popup = function(d) {
        return _chart.title()(d);
    };

    _chart._doRender = function() {
        _map = L.map(_chart.root().node(), _mapOptions);

        if (_defaultCenter && _defaultZoom) {
            _map.setView(_chart.toLocArray(_defaultCenter), _defaultZoom);
        }

        _chart.tiles()(_map);

        _chart._postRender();

        return _chart._doRedraw();
    };

    _chart._postRender = function() {
        //abstract
    };

    _chart.mapOptions = function(_) {
        if (!arguments.length) {
            return _mapOptions;
        }

        _mapOptions = _;
        return _chart;
    };

    _chart.center = function(_) {
        if (!arguments.length) {
            return _defaultCenter;
        }

        _defaultCenter = _;
        return _chart;
    };

    _chart.zoom = function(_) {
        if (!arguments.length) {
            return _defaultZoom;
        }

        _defaultZoom = _;
        return _chart;
    };

    _chart.tiles = function(_) {
        if (!arguments.length) {
            return _tiles;
        }

        _tiles = _;
        return _chart;
    };

    _chart.map = function() {
        return _map;
    };

    _chart.toLocArray = function(value) {
        if (typeof value === 'string') {
            // expects '11.111,1.111'
            value = value.split(',');
        }
        // else expects [11.111,1.111]
        return value;
    };

    _chart.popup = function(_) {
        if (!arguments.length) {
            return _popup;
        }

        _popup = _;
        return _chart;
    };

    _chart.renderPopup = function(_) {
        if (!arguments.length) {
            return _renderPopup;
        }

        _renderPopup = _;
        return _chart;
    };

    return _chart;
};
