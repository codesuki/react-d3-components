'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _d2 = require('d3');

var _d3 = _interopRequireDefault(_d2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var number = _react.PropTypes.number;


var DefaultScalesMixin = {
    propTypes: {
        barPadding: number
    },

    getDefaultProps: function getDefaultProps() {
        return {
            barPadding: 0.5
        };
    },
    componentWillMount: function componentWillMount() {
        this._makeScales(this.props);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this._makeScales(nextProps);
    },
    _makeScales: function _makeScales(props) {
        var xScale = props.xScale,
            xIntercept = props.xIntercept,
            yScale = props.yScale,
            yIntercept = props.yIntercept;


        if (!xScale) {
            var _makeXScale = this._makeXScale(props);

            var _makeXScale2 = _slicedToArray(_makeXScale, 2);

            this._xScale = _makeXScale2[0];
            this._xIntercept = _makeXScale2[1];
        } else {
            var _ref = [xScale, xIntercept];
            this._xScale = _ref[0];
            this._xIntercept = _ref[1];
        }

        if (!yScale) {
            var _makeYScale = this._makeYScale(props);

            var _makeYScale2 = _slicedToArray(_makeYScale, 2);

            this._yScale = _makeYScale2[0];
            this._yIntercept = _makeYScale2[1];
        } else {
            var _ref2 = [yScale, yIntercept];
            this._yScale = _ref2[0];
            this._yIntercept = _ref2[1];
        }
    },
    _makeXScale: function _makeXScale(props) {
        var x = props.x,
            values = props.values;

        var data = this._data;

        if (typeof x(values(data[0])[0]) === 'number') {
            return this._makeLinearXScale(props);
        } else if (typeof x(values(data[0])[0]).getMonth === 'function') {
            return this._makeTimeXScale(props);
        } else {
            return this._makeOrdinalXScale(props);
        }
    },
    _makeLinearXScale: function _makeLinearXScale(props) {
        var x = props.x,
            values = props.values;

        var data = this._data;

        var extentsData = data.map(function (stack) {
            return values(stack).map(function (e) {
                return x(e);
            });
        });
        var extents = _d3.default.extent(Array.prototype.concat.apply([], extentsData));

        var scale = _d3.default.scale.linear().domain(extents).range([0, this._innerWidth]);

        var zero = _d3.default.max([0, scale.domain()[0]]);
        var xIntercept = scale(zero);

        return [scale, xIntercept];
    },
    _makeOrdinalXScale: function _makeOrdinalXScale(props) {
        var x = props.x,
            values = props.values,
            barPadding = props.barPadding;


        var scale = _d3.default.scale.ordinal().domain(values(this._data[0]).map(function (e) {
            return x(e);
        })).rangeRoundBands([0, this._innerWidth], barPadding);

        return [scale, 0];
    },
    _makeTimeXScale: function _makeTimeXScale(props) {
        var x = props.x,
            values = props.values;


        var minDate = _d3.default.min(values(this._data[0]), x);
        var maxDate = _d3.default.max(values(this._data[0]), x);

        var scale = _d3.default.time.scale().domain([minDate, maxDate]).range([0, this._innerWidth]);

        return [scale, 0];
    },
    _makeYScale: function _makeYScale(props) {
        var y = props.y,
            values = props.values;

        var data = this._data;

        if (typeof y(values(data[0])[0]) === 'number') {
            return this._makeLinearYScale(props);
        } else {
            return this._makeOrdinalYScale(props);
        }
    },
    _makeLinearYScale: function _makeLinearYScale(props) {
        var y = props.y,
            y0 = props.y0,
            values = props.values,
            groupedBars = props.groupedBars;


        var extentsData = this._data.map(function (stack) {
            return values(stack).map(function (e) {
                return groupedBars ? y(e) : y0(e) + y(e);
            });
        });
        var extents = _d3.default.extent(Array.prototype.concat.apply([], extentsData));

        extents = [_d3.default.min([0, extents[0]]), extents[1]];

        var scale = _d3.default.scale.linear().domain(extents).range([this._innerHeight, 0]);

        var zero = _d3.default.max([0, scale.domain()[0]]);
        var yIntercept = scale(zero);

        return [scale, yIntercept];
    },
    _makeOrdinalYScale: function _makeOrdinalYScale() {
        var scale = _d3.default.scale.ordinal().range([this._innerHeight, 0]);

        var yIntercept = scale(0);

        return [scale, yIntercept];
    }
};

exports.default = DefaultScalesMixin;