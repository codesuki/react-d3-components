'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Chart = require('./Chart');

var _Chart2 = _interopRequireDefault(_Chart);

var _Bar = require('./Bar');

var _Bar2 = _interopRequireDefault(_Bar);

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
    func = _react.PropTypes.func;

// receive array and return a subsampled array of size n
//
// a= the array;
// n= number of sample you want output

var subSample = function subSample(a, n) {
    var returnArray = [];
    var m = a.length;
    var samplingRatio = m / n;

    //just round down for now in case of comma separated
    for (var i = 0; i < m;) {
        returnArray.push(a[Math.floor(i)]);
        i += samplingRatio;
    }
    return returnArray;
};

var DataSet = _react2.default.createClass({
    displayName: 'DataSet',

    propTypes: {
        data: array.isRequired,
        xScale: func.isRequired,
        yScale: func.isRequired,
        colorScale: func.isRequired,
        values: func.isRequired,
        label: func.isRequired,
        x: func.isRequired,
        y: func.isRequired,
        y0: func.isRequired
    },

    render: function render() {
        var _props = this.props,
            data = _props.data,
            yScale = _props.yScale,
            colorScale = _props.colorScale,
            values = _props.values,
            label = _props.label,
            y = _props.y,
            x0 = _props.x0,
            onMouseEnter = _props.onMouseEnter,
            onMouseLeave = _props.onMouseLeave;


        var height = yScale(yScale.domain()[0]);
        var bars = data.map(function (stack) {
            return values(stack).map(function (e, index) {
                // maps the range [0,1] to the range [0, yDomain]
                var yValue = height * y(e);
                // center vertically to have upper and lower part of the waveform
                var vy = height / 2 - yValue / 2;
                //position x(e) * width * 2 because we want equal sapce.
                var vx = 2 * x0 * index;

                return _react2.default.createElement(_Bar2.default, {
                    key: label(stack) + '.' + index,
                    width: x0,
                    height: yValue,
                    x: vx,
                    y: vy,
                    fill: colorScale(Math.floor(vx)),
                    data: e,
                    onMouseEnter: onMouseEnter,
                    onMouseLeave: onMouseLeave
                });
            });
        });

        return _react2.default.createElement(
            'g',
            null,
            bars
        );
    }
});

var Waveform = _react2.default.createClass({
    displayName: 'Waveform',

    mixins: [_DefaultPropsMixin2.default, _HeightWidthMixin2.default, _ArrayifyMixin2.default, _StackAccessorMixin2.default, _StackDataMixin2.default, _DefaultScalesMixin2.default, _TooltipMixin2.default],

    getDefaultProps: function getDefaultProps() {
        return {};
    },
    _tooltipHtml: function _tooltipHtml(d) {
        var _ref = [this._xScale, this._yScale],
            xScale = _ref[0],
            yScale = _ref[1];


        var html = this.props.tooltipHtml(this.props.x(d), this.props.y0(d), this.props.y(d));

        var midPoint = xScale.rangeBand() / 2;
        var xPos = midPoint + xScale(this.props.x(d));

        var topStack = this._data[this._data.length - 1].values;
        var topElement = null;

        // TODO: this might not scale if dataset is huge.
        // consider pre-computing yPos for each X
        for (var i = 0; i < topStack.length; i++) {
            if (this.props.x(topStack[i]) === this.props.x(d)) {
                topElement = topStack[i];
                break;
            }
        }
        var yPos = yScale(this.props.y0(topElement) + this.props.y(topElement));

        return [html, xPos, yPos];
    },
    render: function render() {
        var _props2 = this.props,
            height = _props2.height,
            width = _props2.width,
            margin = _props2.margin,
            colorScale = _props2.colorScale,
            values = _props2.values,
            label = _props2.label,
            y = _props2.y,
            y0 = _props2.y0,
            x = _props2.x;


        var data = this._data;
        var innerWidth = this._innerWidth;
        var xScale = this._xScale;
        var yScale = this._yScale;

        var preserveAspectRatio = 'none';
        var viewBox = '0 0 ' + width + ' ' + height;

        // there are two options, if the samples are less than the space available
        // we'll stretch the width of bar and inbetween spaces.
        // Otherwise we just subSample the dataArray.
        var barWidth = void 0;
        if (data[0].values.length > innerWidth / 2) {
            data[0].values = subSample(data[0].values, innerWidth / 2);
            barWidth = 1;
        } else {
            barWidth = innerWidth / 2 / data[0].values.length;
        }

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                _Chart2.default,
                {
                    height: height,
                    width: width,
                    margin: margin,
                    viewBox: viewBox,
                    preserveAspectRatio: preserveAspectRatio
                },
                _react2.default.createElement(
                    DataSet,
                    {
                        data: data,
                        xScale: xScale,
                        yScale: yScale,
                        colorScale: colorScale,
                        label: label,
                        values: values,
                        x: x,
                        y: y,
                        y0: y0,
                        x0: barWidth,
                        onMouseEnter: this.onMouseEnter,
                        onMouseLeave: this.onMouseLeave
                    },
                    this.props.children
                )
            )
        );
    }
});

exports.default = Waveform;