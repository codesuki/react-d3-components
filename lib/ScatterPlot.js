"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");
var d3 = require("d3");

var Chart = require("./Chart");
var Axis = require("./Axis");
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
		symbol: React.PropTypes.func.isRequired,
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired,
		onMouseEnter: React.PropTypes.func,
		onMouseLeave: React.PropTypes.func
	},

	render: function render() {
		var _props = this.props;
		var data = _props.data;
		var symbol = _props.symbol;
		var xScale = _props.xScale;
		var yScale = _props.yScale;
		var colorScale = _props.colorScale;
		var label = _props.label;
		var values = _props.values;
		var x = _props.x;
		var y = _props.y;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		var circles = data.map(function (stack) {
			return values(stack).map(function (e, index) {
				var translate = "translate(" + xScale(x(e)) + ", " + yScale(y(e)) + ")";
				return React.createElement("path", {
					key: "" + label(stack) + "." + index,
					className: "dot",
					d: symbol(),
					transform: translate,
					fill: colorScale(label(stack)),
					onMouseOver: function (evt) {
						onMouseEnter(evt, e);
					},
					onMouseLeave: function (evt) {
						onMouseLeave(evt);
					}
				});
			});
		});

		return React.createElement(
			"g",
			null,
			circles
		);
	}
});

var ScatterPlot = React.createClass({
	displayName: "ScatterPlot",

	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, AccessorMixin, DefaultScalesMixin, TooltipMixin],

	propTypes: {
		rScale: React.PropTypes.func,
		shape: React.PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			rScale: null,
			shape: "circle"
		};
	},

	_tooltipHtml: function _tooltipHtml(d, position) {
		var xScale = this._xScale;
		var yScale = this._yScale;

		var html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

		var xPos = xScale(this.props.x(d));
		var yPos = yScale(this.props.y(d));

		return [html, xPos, yPos];
	},

	render: function render() {
		var _props = this.props;
		var height = _props.height;
		var width = _props.width;
		var margin = _props.margin;
		var colorScale = _props.colorScale;
		var rScale = _props.rScale;
		var shape = _props.shape;
		var label = _props.label;
		var values = _props.values;
		var x = _props.x;
		var y = _props.y;
		var xAxis = _props.xAxis;
		var yAxis = _props.yAxis;
		var data = this._data;
		var innerWidth = this._innerWidth;
		var innerHeight = this._innerHeight;
		var xScale = this._xScale;
		var yScale = this._yScale;
		var xIntercept = this._xIntercept;
		var yIntercept = this._yIntercept;

		var symbol = d3.svg.symbol().type(shape);

		if (rScale) {
			symbol = symbol.size(rScale);
		}

		return React.createElement(
			"div",
			null,
			React.createElement(
				Chart,
				{ height: height, width: width, margin: margin },
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
				React.createElement(DataSet, {
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
			React.createElement(Tooltip, this.state.tooltip)
		);
	}
});

module.exports = ScatterPlot;