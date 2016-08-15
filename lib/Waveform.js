"use strict";

var React = require("react");
var d3 = require("d3");

var Chart = require("./Chart");
var Axis = require("./Axis");
var Bar = require("./Bar");
var Tooltip = require("./Tooltip");

var DefaultPropsMixin = require("./DefaultPropsMixin");
var HeightWidthMixin = require("./HeightWidthMixin");
var ArrayifyMixin = require("./ArrayifyMixin");
var StackAccessorMixin = require("./StackAccessorMixin");
var StackDataMixin = require("./StackDataMixin");
var DefaultScalesMixin = require("./DefaultScalesMixin");
var TooltipMixin = require("./TooltipMixin");

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

var DataSet = React.createClass({
    displayName: "DataSet",

    propTypes: {
        data: React.PropTypes.array.isRequired,
        xScale: React.PropTypes.func.isRequired,
        yScale: React.PropTypes.func.isRequired,
        colorScale: React.PropTypes.func.isRequired,
        values: React.PropTypes.func.isRequired,
        label: React.PropTypes.func.isRequired,
        x: React.PropTypes.func.isRequired,
        y: React.PropTypes.func.isRequired,
        y0: React.PropTypes.func.isRequired
    },

    render: function render() {
        var _props = this.props;
        var data = _props.data;
        var xScale = _props.xScale;
        var yScale = _props.yScale;
        var colorScale = _props.colorScale;
        var values = _props.values;
        var label = _props.label;
        var x = _props.x;
        var y = _props.y;
        var y0 = _props.y0;
        var x0 = _props.x0;
        var onMouseEnter = _props.onMouseEnter;
        var onMouseLeave = _props.onMouseLeave;

        var bars = undefined;
        var height = yScale(yScale.domain()[0]);
        bars = data.map(function (stack, serieIndex) {
            return values(stack).map(function (e, index) {
                // maps the range [0,1] to the range [0, yDomain]
                var yValue = height * y(e);
                // center vertically to have upper and lower part of the waveform
                var vy = height / 2 - yValue / 2;
                //position x(e) * width * 2 because we want equal sapce.
                var vx = 2 * x0 * index;

                return React.createElement(Bar, {
                    key: "" + label(stack) + "." + index,
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
        return React.createElement(
            "g",
            null,
            bars
        );
    }
});

var Waveform = React.createClass({
    displayName: "Waveform",

    mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, StackAccessorMixin, StackDataMixin, DefaultScalesMixin, TooltipMixin],

    getDefaultProps: function getDefaultProps() {
        return {};
    },

    _tooltipHtml: function _tooltipHtml(d, position) {
        var xScale = this._xScale;
        var yScale = this._yScale;

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
        var _props = this.props;
        var height = _props.height;
        var width = _props.width;
        var margin = _props.margin;
        var colorScale = _props.colorScale;
        var values = _props.values;
        var label = _props.label;
        var y = _props.y;
        var y0 = _props.y0;
        var x = _props.x;
        var xAxis = _props.xAxis;
        var yAxis = _props.yAxis;
        var groupedBars = _props.groupedBars;
        var data = this._data;
        var innerWidth = this._innerWidth;
        var innerHeight = this._innerHeight;
        var xScale = this._xScale;
        var yScale = this._yScale;

        var preserveAspectRatio = "none";
        var viewBox = "0 0 " + width + " " + height;

        // there are two options, if the samples are less than the space available
        // we'll stretch the width of bar and inbetween spaces.
        // Otherwise we just subSample the dataArray.
        var barWidth = undefined;
        if (data[0].values.length > innerWidth / 2) {
            data[0].values = subSample(data[0].values, innerWidth / 2);
            barWidth = 1;
        } else {
            barWidth = innerWidth / 2 / data[0].values.length;
        }

        return React.createElement("div", null, React.createElement(Chart, { height: height, width: width, margin: margin, viewBox: viewBox, preserveAspectRatio: preserveAspectRatio }, React.createElement(DataSet, {
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
        }), this.props.children));
    }
});

module.exports = Waveform;