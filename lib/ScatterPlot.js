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
        symbol: func.isRequired,
        xScale: func.isRequired,
        yScale: func.isRequired,
        colorScale: func.isRequired,
        onMouseEnter: func,
        onMouseLeave: func
    },

    render: function render() {
        var _props = this.props,
            data = _props.data,
            symbol = _props.symbol,
            xScale = _props.xScale,
            yScale = _props.yScale,
            colorScale = _props.colorScale,
            label = _props.label,
            values = _props.values,
            x = _props.x,
            y = _props.y,
            onMouseEnter = _props.onMouseEnter,
            _onMouseLeave = _props.onMouseLeave;


        var circles = data.map(function (stack) {
            return values(stack).map(function (e, index) {
                var translate = 'translate(' + xScale(x(e)) + ', ' + yScale(y(e)) + ')';
                return _react2.default.createElement('path', {
                    key: label(stack) + '.' + index,
                    className: 'dot',
                    d: symbol(),
                    transform: translate,
                    fill: colorScale(label(stack)),
                    onMouseOver: function onMouseOver(evt) {
                        return onMouseEnter(evt, e);
                    },
                    onMouseLeave: function onMouseLeave(evt) {
                        return _onMouseLeave(evt);
                    }
                });
            });
        });

        return _react2.default.createElement(
            'g',
            null,
            circles
        );
    }
});

var ScatterPlot = _react2.default.createClass({
    displayName: 'ScatterPlot',

    mixins: [_DefaultPropsMixin2.default, _HeightWidthMixin2.default, _ArrayifyMixin2.default, _AccessorMixin2.default, _DefaultScalesMixin2.default, _TooltipMixin2.default],

    propTypes: {
        rScale: func,
        shape: string
    },

    getDefaultProps: function getDefaultProps() {
        return {
            rScale: null,
            shape: 'circle'
        };
    },
    _tooltipHtml: function _tooltipHtml(d) {
        var html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

        var xPos = this._xScale(this.props.x(d));
        var yPos = this._yScale(this.props.y(d));

        return [html, xPos, yPos];
    },
    render: function render() {
        var _props2 = this.props,
            height = _props2.height,
            width = _props2.width,
            margin = _props2.margin,
            colorScale = _props2.colorScale,
            rScale = _props2.rScale,
            shape = _props2.shape,
            label = _props2.label,
            values = _props2.values,
            x = _props2.x,
            y = _props2.y,
            xAxis = _props2.xAxis,
            yAxis = _props2.yAxis;


        var data = this._data;
        var innerWidth = this._innerWidth;
        var innerHeight = this._innerHeight;
        var xScale = this._xScale;
        var yScale = this._yScale;
        var xIntercept = this._xIntercept;
        var yIntercept = this._yIntercept;

        var symbol = _d2.default.svg.symbol().type(shape);

        if (rScale) {
            symbol = symbol.size(rScale);
        }

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                _Chart2.default,
                { height: height, width: width, margin: margin },
                _react2.default.createElement(_Axis2.default, _extends({
                    className: 'x axis',
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
                _react2.default.createElement(DataSet, {
                    data: data,
                    xScale: xScale,
                    yScale: yScale,
                    colorScale: colorScale,
                    symbol: symbol,
                    label: label,
                    values: values,
                    x: x,
                    y: y,
                    onMouseEnter: this.onMouseEnter,
                    onMouseLeave: this.onMouseLeave
                }),
                this.props.children
            ),
            _react2.default.createElement(_Tooltip2.default, this.state.tooltip)
        );
    }
});

exports.default = ScatterPlot;