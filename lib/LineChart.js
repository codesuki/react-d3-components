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

var _AccessorMixin = require('./AccessorMixin');

var _AccessorMixin2 = _interopRequireDefault(_AccessorMixin);

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
        line: func.isRequired,
        colorScale: func.isRequired
    },

    render: function render() {
        var _props = this.props,
            width = _props.width,
            height = _props.height,
            data = _props.data,
            line = _props.line,
            strokeWidth = _props.strokeWidth,
            strokeLinecap = _props.strokeLinecap,
            strokeDasharray = _props.strokeDasharray,
            colorScale = _props.colorScale,
            values = _props.values,
            label = _props.label,
            onMouseEnter = _props.onMouseEnter,
            _onMouseLeave = _props.onMouseLeave;


        var sizeId = width + 'x' + height;

        var lines = data.map(function (stack, index) {
            return _react2.default.createElement(_Path2.default, {
                key: label(stack) + '.' + index,
                className: 'line',
                d: line(values(stack)),
                stroke: colorScale(label(stack)),
                strokeWidth: typeof strokeWidth === 'function' ? strokeWidth(label(stack)) : strokeWidth,
                strokeLinecap: typeof strokeLinecap === 'function' ? strokeLinecap(label(stack)) : strokeLinecap,
                strokeDasharray: typeof strokeDasharray === 'function' ? strokeDasharray(label(stack)) : strokeDasharray,
                data: values(stack),
                onMouseEnter: onMouseEnter,
                onMouseLeave: _onMouseLeave,
                style: { clipPath: 'url(#lineClip_' + sizeId + ')' }
            });
        });

        /*
         The <rect> below is needed in case we want to show the tooltip no matter where on the chart the mouse is.
         Not sure if this should be used.
         */
        return _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement(
                'defs',
                null,
                _react2.default.createElement(
                    'clipPath',
                    { id: 'lineClip_' + sizeId },
                    _react2.default.createElement('rect', { width: width, height: height })
                )
            ),
            lines,
            _react2.default.createElement('rect', {
                width: width,
                height: height,
                fill: 'none',
                stroke: 'none',
                style: { pointerEvents: 'all' },
                onMouseMove: function onMouseMove(evt) {
                    onMouseEnter(evt, data);
                },
                onMouseLeave: function onMouseLeave(evt) {
                    _onMouseLeave(evt);
                }
            })
        );
    }
});

var LineChart = _react2.default.createClass({
    displayName: 'LineChart',

    mixins: [_DefaultPropsMixin2.default, _HeightWidthMixin2.default, _ArrayifyMixin2.default, _AccessorMixin2.default, _DefaultScalesMixin2.default, _TooltipMixin2.default],

    propTypes: {
        interpolate: string,
        defined: func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            interpolate: 'linear',
            defined: function defined() {
                return true;
            },
            shape: 'circle',
            shapeColor: null
        };
    },


    /*
     The code below supports finding the data values for the line closest to the mouse cursor.
     Since it gets all events from the Rect overlaying the Chart the tooltip gets shown everywhere.
     For now I don't want to use this method.
     */
    _tooltipHtml: function _tooltipHtml(data, position) {
        var _props2 = this.props,
            x = _props2.x,
            y = _props2.y,
            values = _props2.values,
            label = _props2.label;

        var xScale = this._xScale;
        var yScale = this._yScale;

        var xValueCursor = xScale.invert(position[0]);
        var yValueCursor = yScale.invert(position[1]);

        var xBisector = _d2.default.bisector(function (e) {
            return x(e);
        }).left;
        var valuesAtX = data.map(function (stack) {
            var idx = xBisector(values(stack), xValueCursor);

            var indexRight = idx === values(stack).length ? idx - 1 : idx;
            var valueRight = x(values(stack)[indexRight]);

            var indexLeft = idx === 0 ? idx : idx - 1;
            var valueLeft = x(values(stack)[indexLeft]);

            var index = void 0;
            if (Math.abs(xValueCursor - valueRight) < Math.abs(xValueCursor - valueLeft)) {
                index = indexRight;
            } else {
                index = indexLeft;
            }

            return { label: label(stack), value: values(stack)[index] };
        });

        valuesAtX.sort(function (a, b) {
            return y(a.value) - y(b.value);
        });

        var yBisector = _d2.default.bisector(function (e) {
            return y(e.value);
        }).left;
        var yIndex = yBisector(valuesAtX, yValueCursor);

        var yIndexRight = yIndex === valuesAtX.length ? yIndex - 1 : yIndex;
        var yIndexLeft = yIndex === 0 ? yIndex : yIndex - 1;

        var yValueRight = y(valuesAtX[yIndexRight].value);
        var yValueLeft = y(valuesAtX[yIndexLeft].value);

        var index = void 0;
        if (Math.abs(yValueCursor - yValueRight) < Math.abs(yValueCursor - yValueLeft)) {
            index = yIndexRight;
        } else {
            index = yIndexLeft;
        }

        this._tooltipData = valuesAtX[index];

        var html = this.props.tooltipHtml(valuesAtX[index].label, valuesAtX[index].value);

        var xPos = xScale(valuesAtX[index].value.x);
        var yPos = yScale(valuesAtX[index].value.y);

        return [html, xPos, yPos];
    },


    /*
    _tooltipHtml(data, position) {
        let {x, y0, y, values, label} = this.props;
        let [xScale, yScale] = [this._xScale, this._yScale];
         let xValueCursor = xScale.invert(position[0]);
        let yValueCursor = yScale.invert(position[1]);
         let xBisector = d3.bisector(e => { return x(e); }).left;
        let xIndex = xBisector(data, xScale.invert(position[0]));
         let indexRight = xIndex == data.length ? xIndex - 1 : xIndex;
        let valueRight = x(data[indexRight]);
         let indexLeft = xIndex == 0 ? xIndex : xIndex - 1;
        let valueLeft = x(data[indexLeft]);
         let index;
        if (Math.abs(xValueCursor - valueRight) < Math.abs(xValueCursor - valueLeft)) {
            index = indexRight;
        } else {
            index = indexLeft;
        }
         let yValue = y(data[index]);
        let cursorValue = d3.round(yScale.invert(position[1]), 2);
         return this.props.tooltipHtml(yValue, cursorValue);
    },
     */

    /*
             stroke,
             strokeWidth,
             strokeLinecap,
             strokeDasharray,
     */
    render: function render() {
        var _this = this;

        var _props3 = this.props,
            height = _props3.height,
            width = _props3.width,
            margin = _props3.margin,
            colorScale = _props3.colorScale,
            interpolate = _props3.interpolate,
            defined = _props3.defined,
            stroke = _props3.stroke,
            values = _props3.values,
            label = _props3.label,
            x = _props3.x,
            y = _props3.y,
            xAxis = _props3.xAxis,
            yAxis = _props3.yAxis,
            shape = _props3.shape,
            shapeColor = _props3.shapeColor;


        var data = this._data;
        var innerWidth = this._innerWidth;
        var innerHeight = this._innerHeight;
        var xScale = this._xScale;
        var yScale = this._yScale;
        var xIntercept = this._xIntercept;
        var yIntercept = this._yIntercept;

        var line = _d2.default.svg.line().x(function (e) {
            return xScale(x(e));
        }).y(function (e) {
            return yScale(y(e));
        }).interpolate(interpolate).defined(defined);

        var tooltipSymbol = null;
        if (!this.state.tooltip.hidden) {
            var symbol = _d2.default.svg.symbol().type(shape);
            var symbolColor = shapeColor ? shapeColor : colorScale(this._tooltipData.label);

            var translate = this._tooltipData ? 'translate(' + xScale(x(this._tooltipData.value)) + ', ' + yScale(y(this._tooltipData.value)) + ')' : '';
            tooltipSymbol = this.state.tooltip.hidden ? null : _react2.default.createElement('path', {
                className: 'dot',
                d: symbol(),
                transform: translate,
                fill: symbolColor,
                onMouseEnter: function onMouseEnter(evt) {
                    return _this.onMouseEnter(evt, data);
                },
                onMouseLeave: function onMouseLeave(evt) {
                    return _this.onMouseLeave(evt);
                }
            });
        }

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                _Chart2.default,
                { height: height, width: width, margin: margin },
                _react2.default.createElement(_Axis2.default, _extends({
                    className: '\'x axis\'',
                    orientation: 'bottom',
                    scale: xScale,
                    height: innerHeight,
                    width: innerWidth,
                    zero: yIntercept
                }, xAxis)),
                _react2.default.createElement(_Axis2.default, _extends({
                    className: 'y axis',
                    orientation: 'left',
                    scale: yScale,
                    height: innerHeight,
                    width: innerWidth,
                    zero: xIntercept
                }, yAxis)),
                _react2.default.createElement(DataSet, _extends({
                    height: innerHeight,
                    width: innerWidth,
                    data: data,
                    line: line,
                    colorScale: colorScale,
                    values: values,
                    label: label,
                    onMouseEnter: this.onMouseEnter,
                    onMouseLeave: this.onMouseLeave
                }, stroke)),
                this.props.children,
                tooltipSymbol
            ),
            _react2.default.createElement(_Tooltip2.default, this.state.tooltip)
        );
    }
});

exports.default = LineChart;