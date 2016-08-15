"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");
var d3 = require("d3");

var Chart = require("./Chart");
var Axis = require("./Axis");
var Path = require("./Path");
var Tooltip = require("./Tooltip");

var DefaultPropsMixin = require("./DefaultPropsMixin");
var HeightWidthMixin = require("./HeightWidthMixin");
var ArrayifyMixin = require("./ArrayifyMixin");
var AccessorMixin = require("./AccessorMixin");
var DefaultScalesMixin = require("./DefaultScalesMixin");
var TooltipMixin = require("./TooltipMixin");

var DataSet = React.createClass({
	displayName: "DataSet",

	propTypes: {
		data: React.PropTypes.array.isRequired,
		line: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired
	},

	render: function render() {
		var _props = this.props;
		var width = _props.width;
		var height = _props.height;
		var data = _props.data;
		var line = _props.line;
		var strokeWidth = _props.strokeWidth;
		var strokeLinecap = _props.strokeLinecap;
		var strokeDasharray = _props.strokeDasharray;
		var colorScale = _props.colorScale;
		var values = _props.values;
		var label = _props.label;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		var sizeId = width + "x" + height;

		var lines = data.map(function (stack, index) {
			return React.createElement(Path, {
				key: "" + label(stack) + "." + index,
				className: "line",
				d: line(values(stack)),
				stroke: colorScale(label(stack)),
				strokeWidth: typeof strokeWidth === "function" ? strokeWidth(label(stack)) : strokeWidth,
				strokeLinecap: typeof strokeLinecap === "function" ? strokeLinecap(label(stack)) : strokeLinecap,
				strokeDasharray: typeof strokeDasharray === "function" ? strokeDasharray(label(stack)) : strokeDasharray,
				data: values(stack),
				onMouseEnter: onMouseEnter,
				onMouseLeave: onMouseLeave,
				style: { clipPath: "url(#lineClip_" + sizeId + ")" }
			});
		});

		/*
   The <rect> below is needed in case we want to show the tooltip no matter where on the chart the mouse is.
   Not sure if this should be used.
   */
		return React.createElement(
			"g",
			null,
			React.createElement(
				"defs",
				null,
				React.createElement(
					"clipPath",
					{ id: "lineClip_" + sizeId },
					React.createElement("rect", { width: width, height: height })
				)
			),
			lines,
			React.createElement("rect", { width: width, height: height, fill: "none", stroke: "none", style: { pointerEvents: "all" },
				onMouseMove: function (evt) {
					onMouseEnter(evt, data);
				},
				onMouseLeave: function (evt) {
					onMouseLeave(evt);
				}
			})
		);
	}
});

var LineChart = React.createClass({
	displayName: "LineChart",

	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, AccessorMixin, DefaultScalesMixin, TooltipMixin],

	propTypes: {
		interpolate: React.PropTypes.string,
		defined: React.PropTypes.func
	},

	getDefaultProps: function getDefaultProps() {
		return {
			interpolate: "linear",
			defined: function () {
				return true;
			},
			shape: "circle",
			shapeColor: null
		};
	},

	/*
  The code below supports finding the data values for the line closest to the mouse cursor.
  Since it gets all events from the Rect overlaying the Chart the tooltip gets shown everywhere.
  For now I don't want to use this method.
  */
	_tooltipHtml: function _tooltipHtml(data, position) {
		var _props = this.props;
		var x = _props.x;
		var y0 = _props.y0;
		var y = _props.y;
		var values = _props.values;
		var label = _props.label;
		var xScale = this._xScale;
		var yScale = this._yScale;

		var xValueCursor = xScale.invert(position[0]);
		var yValueCursor = yScale.invert(position[1]);

		var xBisector = d3.bisector(function (e) {
			return x(e);
		}).left;
		var valuesAtX = data.map(function (stack) {
			var idx = xBisector(values(stack), xValueCursor);

			var indexRight = idx === values(stack).length ? idx - 1 : idx;
			var valueRight = x(values(stack)[indexRight]);

			var indexLeft = idx === 0 ? idx : idx - 1;
			var valueLeft = x(values(stack)[indexLeft]);

			var index = undefined;
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

		var yBisector = d3.bisector(function (e) {
			return y(e.value);
		}).left;
		var yIndex = yBisector(valuesAtX, yValueCursor);

		var yIndexRight = yIndex === valuesAtX.length ? yIndex - 1 : yIndex;
		var yIndexLeft = yIndex === 0 ? yIndex : yIndex - 1;

		var yValueRight = y(valuesAtX[yIndexRight].value);
		var yValueLeft = y(valuesAtX[yIndexLeft].value);

		var index = undefined;
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

		var _props = this.props;
		var height = _props.height;
		var width = _props.width;
		var margin = _props.margin;
		var colorScale = _props.colorScale;
		var interpolate = _props.interpolate;
		var defined = _props.defined;
		var stroke = _props.stroke;
		var values = _props.values;
		var label = _props.label;
		var x = _props.x;
		var y = _props.y;
		var xAxis = _props.xAxis;
		var yAxis = _props.yAxis;
		var shape = _props.shape;
		var shapeColor = _props.shapeColor;
		var data = this._data;
		var innerWidth = this._innerWidth;
		var innerHeight = this._innerHeight;
		var xScale = this._xScale;
		var yScale = this._yScale;
		var xIntercept = this._xIntercept;
		var yIntercept = this._yIntercept;

		var line = d3.svg.line().x(function (e) {
			return xScale(x(e));
		}).y(function (e) {
			return yScale(y(e));
		}).interpolate(interpolate).defined(defined);

		var tooltipSymbol = undefined;
		if (!this.state.tooltip.hidden) {
			var symbol = d3.svg.symbol().type(shape);
			var symbolColor = shapeColor ? shapeColor : colorScale(this._tooltipData.label);

			var translate = this._tooltipData ? "translate(" + xScale(x(this._tooltipData.value)) + ", " + yScale(y(this._tooltipData.value)) + ")" : "";
			tooltipSymbol = this.state.tooltip.hidden ? null : React.createElement("path", {
				className: "dot",
				d: symbol(),
				transform: translate,
				fill: symbolColor,
				onMouseEnter: function (evt) {
					_this.onMouseEnter(evt, data);
				},
				onMouseLeave: function (evt) {
					_this.onMouseLeave(evt);
				}
			});
		}

		return React.createElement(
			"div",
			null,
			React.createElement(
				Chart,
				{ height: height, width: width, margin: margin },
				React.createElement(DataSet, _extends({
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
				React.createElement(Axis, _extends({
					className: "x axis",
					orientation: "bottom",
					scale: xScale,
					height: innerHeight,
					width: innerWidth,
					zero: yIntercept
				}, xAxis)),
				React.createElement(Axis, _extends({
					className: "y axis",
					orientation: "left",
					scale: yScale,
					height: innerHeight,
					width: innerWidth,
					zero: xIntercept
				}, yAxis)),
				this.props.children,
				tooltipSymbol
			),
			React.createElement(Tooltip, this.state.tooltip)
		);
	}
});

module.exports = LineChart;