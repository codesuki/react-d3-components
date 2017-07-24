'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _Chart = require('./Chart');

var _Chart2 = _interopRequireDefault(_Chart);

var _Axis = require('./Axis');

var _Axis2 = _interopRequireDefault(_Axis);

var _Path = require('./Path');

var _Path2 = _interopRequireDefault(_Path);

var _Tooltip = require('./Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _DefaultPropsMixin = require('./DefaultPropsMixin');

var _DefaultPropsMixin2 = _interopRequireDefault(_DefaultPropsMixin);

var _HeightWidthMixin = require('./HeightWidthMixin');

var _HeightWidthMixin2 = _interopRequireDefault(_HeightWidthMixin);

var _ArrayifyMixin = require('./ArrayifyMixin');

var _ArrayifyMixin2 = _interopRequireDefault(_ArrayifyMixin);

var _StackAccessorMixin = require('./StackAccessorMixin');

var _StackAccessorMixin2 = _interopRequireDefault(_StackAccessorMixin);

var _StackDataMixin = require('./StackDataMixin');

var _StackDataMixin2 = _interopRequireDefault(_StackDataMixin);

var _DefaultScalesMixin = require('./DefaultScalesMixin');

var _DefaultScalesMixin2 = _interopRequireDefault(_DefaultScalesMixin);

var _TooltipMixin = require('./TooltipMixin');

var _TooltipMixin2 = _interopRequireDefault(_TooltipMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var array = _react.PropTypes.array,
    func = _react.PropTypes.func,
    string = _react.PropTypes.string;


var DataSet = _react2.default.createClass({
    displayName: 'DataSet',

    propTypes: {
        data: array.isRequired,
        area: func.isRequired,
        line: func.isRequired,
        colorScale: func.isRequired,
        stroke: func.isRequired
    },

    render: function render() {
        var _props = this.props,
            data = _props.data,
            area = _props.area,
            colorScale = _props.colorScale,
            values = _props.values,
            label = _props.label,
            onMouseEnter = _props.onMouseEnter,
            onMouseLeave = _props.onMouseLeave;


        var areas = data.map(function (stack, index) {
            return _react2.default.createElement(_Path2.default, {
                key: label(stack) + '.' + index,
                className: 'area',
                stroke: 'none',
                fill: colorScale(label(stack)),
                d: area(values(stack)),
                onMouseEnter: onMouseEnter,
                onMouseLeave: onMouseLeave,
                data: data
            });
        });

        return _react2.default.createElement(
            'g',
            null,
            areas
        );
    }
});

var AreaChart = _react2.default.createClass({
    displayName: 'AreaChart',

    mixins: [_DefaultPropsMixin2.default, _HeightWidthMixin2.default, _ArrayifyMixin2.default, _StackAccessorMixin2.default, _StackDataMixin2.default, _DefaultScalesMixin2.default, _TooltipMixin2.default],

    propTypes: {
        interpolate: string,
        stroke: func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            interpolate: 'linear',
            stroke: _d2.default.scale.category20()
        };
    },
    _tooltipHtml: function _tooltipHtml(d, position) {
        var _props2 = this.props,
            x = _props2.x,
            y0 = _props2.y0,
            y = _props2.y,
            values = _props2.values;

        var xScale = this._xScale;
        var yScale = this._yScale;

        var xValueCursor = xScale.invert(position[0]);

        var xBisector = _d2.default.bisector(function (e) {
            return x(e);
        }).right;
        var xIndex = xBisector(values(d[0]), xScale.invert(position[0]));
        xIndex = xIndex == values(d[0]).length ? xIndex - 1 : xIndex;

        var xIndexRight = xIndex == values(d[0]).length ? xIndex - 1 : xIndex;
        var xValueRight = x(values(d[0])[xIndexRight]);

        var xIndexLeft = xIndex == 0 ? xIndex : xIndex - 1;
        var xValueLeft = x(values(d[0])[xIndexLeft]);

        if (Math.abs(xValueCursor - xValueRight) < Math.abs(xValueCursor - xValueLeft)) {
            xIndex = xIndexRight;
        } else {
            xIndex = xIndexLeft;
        }

        var yValueCursor = yScale.invert(position[1]);

        var yBisector = _d2.default.bisector(function (e) {
            return y0(values(e)[xIndex]) + y(values(e)[xIndex]);
        }).left;
        var yIndex = yBisector(d, yValueCursor);
        yIndex = yIndex == d.length ? yIndex - 1 : yIndex;

        var yValue = y(values(d[yIndex])[xIndex]);
        var yValueCumulative = y0(values(d[d.length - 1])[xIndex]) + y(values(d[d.length - 1])[xIndex]);

        var xValue = x(values(d[yIndex])[xIndex]);

        var xPos = xScale(xValue);
        var yPos = yScale(y0(values(d[yIndex])[xIndex]) + yValue);

        return [this.props.tooltipHtml(yValue, yValueCumulative, xValue), xPos, yPos];
    },
    render: function render() {
        var _props3 = this.props,
            height = _props3.height,
            width = _props3.width,
            margin = _props3.margin,
            colorScale = _props3.colorScale,
            interpolate = _props3.interpolate,
            stroke = _props3.stroke,
            values = _props3.values,
            label = _props3.label,
            x = _props3.x,
            y = _props3.y,
            y0 = _props3.y0,
            xAxis = _props3.xAxis,
            yAxis = _props3.yAxis,
            yOrientation = _props3.yOrientation;


        var data = this._data;
        var innerWidth = this._innerWidth;
        var innerHeight = this._innerHeight;
        var xScale = this._xScale;
        var yScale = this._yScale;

        var line = _d2.default.svg.line().x(function (e) {
            return xScale(x(e));
        }).y(function (e) {
            return yScale(y0(e) + y(e));
        }).interpolate(interpolate);

        var area = _d2.default.svg.area().x(function (e) {
            return xScale(x(e));
        }).y0(function (e) {
            return yScale(yScale.domain()[0] + y0(e));
        }).y1(function (e) {
            return yScale(y0(e) + y(e));
        }).interpolate(interpolate);

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                _Chart2.default,
                { height: height, width: width, margin: margin },
                _react2.default.createElement(DataSet, {
                    data: data,
                    line: line,
                    area: area,
                    colorScale: colorScale,
                    stroke: stroke,
                    label: label,
                    values: values,
                    onMouseEnter: this.onMouseEnter,
                    onMouseLeave: this.onMouseLeave
                }),
                _react2.default.createElement(_Axis2.default, _extends({
                    className: 'x axis',
                    orientation: 'bottom',
                    scale: xScale,
                    height: innerHeight,
                    width: innerWidth
                }, xAxis)),
                _react2.default.createElement(_Axis2.default, _extends({
                    className: 'y axis',
                    orientation: yOrientation ? yOrientation : 'left',
                    scale: yScale,
                    height: innerHeight,
                    width: innerWidth
                }, yAxis)),
                this.props.children
            ),
            _react2.default.createElement(_Tooltip2.default, this.state.tooltip)
        );
    }
});

exports.default = AreaChart;