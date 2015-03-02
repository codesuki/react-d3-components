!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ReactD3=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");

var AccessorMixin = {
	propTypes: {
		label: React.PropTypes.func,
		values: React.PropTypes.func,
		x: React.PropTypes.func,
		y: React.PropTypes.func,
		y0: React.PropTypes.func
	},

	getDefaultProps: function getDefaultProps() {
		return {
			label: function (stack) {
				return stack.label;
			},
			values: function (stack) {
				return stack.values;
			},
			x: function (e) {
				return e.x;
			},
			y: function (e) {
				return e.y;
			},
			y0: function (e) {
				return 0;
			}
		};
	}
};

module.exports = AccessorMixin;

},{"./ReactProvider":15}],2:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Chart = require("./Chart");
var Axis = require("./Axis");
var Path = require("./Path");
var Tooltip = require("./Tooltip");

var DefaultPropsMixin = require("./DefaultPropsMixin");
var HeightWidthMixin = require("./HeightWidthMixin");
var ArrayifyMixin = require("./ArrayifyMixin");
var StackAccessorMixin = require("./StackAccessorMixin");
var StackDataMixin = require("./StackDataMixin");
var DefaultScalesMixin = require("./DefaultScalesMixin");
var TooltipMixin = require("./TooltipMixin");

var DataSet = React.createClass({
	displayName: "DataSet",

	propTypes: {
		data: React.PropTypes.array.isRequired,
		area: React.PropTypes.func.isRequired,
		line: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired,
		stroke: React.PropTypes.func.isRequired
	},

	render: function render() {
		var _props = this.props;
		var data = _props.data;
		var area = _props.area;
		var line = _props.line;
		var colorScale = _props.colorScale;
		var stroke = _props.stroke;
		var values = _props.values;
		var label = _props.label;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		var areas = data.map(function (stack) {
			return React.createElement(Path, {
				className: "area",
				stroke: "none",
				fill: colorScale(label(stack)),
				d: area(values(stack)),
				onMouseEnter: onMouseEnter,
				onMouseLeave: onMouseLeave,
				data: data
			});
		});

		var lines = data.map(function (stack) {
			return React.createElement(Path, {
				className: "line",
				d: line(values(stack)),
				stroke: stroke(label(stack))
			});
		});

		return React.createElement(
			"g",
			null,
			areas
		);
	}
});

var AreaChart = React.createClass({
	displayName: "AreaChart",

	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, StackAccessorMixin, StackDataMixin, DefaultScalesMixin, TooltipMixin],

	propTypes: {
		interpolate: React.PropTypes.string,
		stroke: React.PropTypes.func
	},

	getDefaultProps: function getDefaultProps() {
		return {
			interpolate: "linear",
			stroke: d3.scale.category20()
		};
	},

	_tooltipHtml: function _tooltipHtml(d, position) {
		var _props = this.props;
		var x = _props.x;
		var y0 = _props.y0;
		var y = _props.y;
		var values = _props.values;
		var label = _props.label;
		var xScale = this._xScale;
		var yScale = this._yScale;

		var xValueCursor = xScale.invert(position[0]);

		var xBisector = d3.bisector(function (e) {
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

		var yBisector = d3.bisector(function (e) {
			return y0(values(e)[xIndex]) + y(values(e)[xIndex]);
		}).left;
		var yIndex = yBisector(d, yValueCursor);
		yIndex = yIndex == d.length ? yIndex - 1 : yIndex;

		var yValue = y(values(d[yIndex])[xIndex]);
		var yValueCumulative = y0(values(d[d.length - 1])[xIndex]) + y(values(d[d.length - 1])[xIndex]);

		return this.props.tooltipHtml(yValue, yValueCumulative);
	},

	render: function render() {
		var _props = this.props;
		var height = _props.height;
		var width = _props.width;
		var margin = _props.margin;
		var colorScale = _props.colorScale;
		var interpolate = _props.interpolate;
		var stroke = _props.stroke;
		var offset = _props.offset;
		var values = _props.values;
		var label = _props.label;
		var x = _props.x;
		var y = _props.y;
		var y0 = _props.y0;
		var xAxis = _props.xAxis;
		var yAxis = _props.yAxis;
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
			return yScale(y0(e) + y(e));
		}).interpolate(interpolate);

		var area = d3.svg.area().x(function (e) {
			return xScale(x(e));
		}).y0(function (e) {
			return yScale(yScale.domain()[0] + y0(e));
		}).y1(function (e) {
			return yScale(y0(e) + y(e));
		}).interpolate(interpolate);

		return React.createElement(
			"div",
			null,
			React.createElement(
				Chart,
				{ height: height, width: width, margin: margin },
				React.createElement(DataSet, {
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
				React.createElement(Axis, _extends({
					className: "x axis",
					orientation: "bottom",
					scale: xScale,
					height: innerHeight,
					width: innerWidth
				}, xAxis)),
				React.createElement(Axis, _extends({
					className: "y axis",
					orientation: "left",
					scale: yScale,
					height: innerHeight,
					width: innerWidth
				}, yAxis))
			),
			React.createElement(Tooltip, {
				hidden: this.state.tooltip.hidden,
				top: this.state.tooltip.top,
				left: this.state.tooltip.left,
				html: this.state.tooltip.html })
		);
	}
});

module.exports = AreaChart;

},{"./ArrayifyMixin":3,"./Axis":4,"./Chart":7,"./D3Provider":8,"./DefaultPropsMixin":9,"./DefaultScalesMixin":10,"./HeightWidthMixin":11,"./Path":13,"./ReactProvider":15,"./StackAccessorMixin":17,"./StackDataMixin":18,"./Tooltip":19,"./TooltipMixin":20}],3:[function(require,module,exports){
"use strict";

var ArrayifyMixin = {
	componentWillMount: function componentWillMount() {
		this._arrayify(this.props);
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this._arrayify(nextProps);
	},

	_arrayify: function _arrayify(props) {
		if (!Array.isArray(props.data)) {
			this._data = [props.data];
		} else {
			this._data = props.data;
		}
	}
};

module.exports = ArrayifyMixin;

},{}],4:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Axis = React.createClass({
	displayName: "Axis",

	propTypes: {
		tickArguments: React.PropTypes.array,
		tickValues: React.PropTypes.array,
		tickFormat: React.PropTypes.func,
		innerTickSize: React.PropTypes.number,
		tickPadding: React.PropTypes.number,
		outerTickSize: React.PropTypes.number,
		scale: React.PropTypes.func.isRequired,
		className: React.PropTypes.string,
		zero: React.PropTypes.number,
		orientation: React.PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
		label: React.PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			tickArguments: [10],
			tickValues: null,
			tickFormat: function (x) {
				return x;
			},
			innerTickSize: 6,
			tickPadding: 3,
			outerTickSize: 6,
			className: "axis",
			zero: 0,
			label: ""
		};
	},

	_getTranslateString: function _getTranslateString() {
		var _props = this.props;
		var orientation = _props.orientation;
		var height = _props.height;
		var width = _props.width;
		var zero = _props.zero;

		if (orientation === "top") {
			return "translate(0, " + zero + ")";
		} else if (orientation === "bottom") {
			return "translate(0, " + (zero == 0 ? height : zero) + ")";
		} else if (orientation === "left") {
			return "translate(" + zero + ", 0)";
		} else if (orientation === "right") {
			return "translate(" + (zero == 0 ? width : zero) + ", 0)";
		} else {
			return "";
		}
	},

	render: function render() {
		var _props = this.props;
		var height = _props.height;
		var width = _props.width;
		var tickArguments = _props.tickArguments;
		var tickValues = _props.tickValues;
		var tickFormat = _props.tickFormat;
		var innerTickSize = _props.innerTickSize;
		var tickPadding = _props.tickPadding;
		var outerTickSize = _props.outerTickSize;
		var scale = _props.scale;
		var orientation = _props.orientation;
		var className = _props.className;
		var zero = _props.zero;
		var label = _props.label;

		var ticks = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues;

		if (scale.tickFormat) {
			tickFormat = scale.tickFormat.apply(scale, tickArguments);
		}

		// TODO: is there a cleaner way? removes the 0 tick if axes are crossing
		if (zero != height && zero != width && zero != 0) {
			ticks = ticks.filter(function (element, index, array) {
				return element == 0 ? false : true;
			});
		}

		var tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

		var sign = orientation === "top" || orientation === "left" ? -1 : 1;

		var range = this._d3_scaleRange(scale);

		var activeScale = scale.rangeBand ? function (e) {
			return scale(e) + scale.rangeBand() / 2;
		} : scale;

		var transform = undefined,
		    x = undefined,
		    y = undefined,
		    x2 = undefined,
		    y2 = undefined,
		    dy = undefined,
		    textAnchor = undefined,
		    d = undefined,
		    labelElement = undefined;
		if (orientation === "bottom" || orientation === "top") {
			transform = "translate({}, 0)";
			x = 0;
			y = sign * tickSpacing;
			x2 = 0;
			y2 = sign * innerTickSize;
			dy = sign < 0 ? "0em" : ".71em";
			textAnchor = "middle";
			d = "M" + range[0] + ", " + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize;

			labelElement = React.createElement(
				"text",
				{ className: "" + className + " label", textAnchor: "end", x: width, y: -6 },
				label
			);
		} else {
			transform = "translate(0, {})";
			x = sign * tickSpacing;
			y = 0;
			x2 = sign * innerTickSize;
			y2 = 0;
			dy = ".32em";
			textAnchor = sign < 0 ? "end" : "start";
			d = "M" + sign * outerTickSize + ", " + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize;

			labelElement = React.createElement(
				"text",
				{ className: "" + className + " label", textAnchor: "end", y: 6, dy: ".75em", transform: "rotate(-90)" },
				label
			);
		}

		var tickElements = ticks.map(function (tick) {
			var position = activeScale(tick);
			var translate = transform.replace("{}", position);
			return React.createElement(
				"g",
				{ className: "tick", transform: translate },
				React.createElement("line", { x2: x2, y2: y2, stroke: "#aaa" }),
				React.createElement(
					"text",
					{ x: x, y: y, dy: dy, textAnchor: textAnchor },
					tickFormat(tick)
				)
			);
		});

		var pathElement = React.createElement("path", { className: "domain", d: d, fill: "none", stroke: "#aaa" });

		return React.createElement(
			"g",
			{ ref: "axis", className: className, transform: this._getTranslateString(), style: { shapeRendering: "crispEdges" } },
			tickElements,
			pathElement,
			labelElement
		);
	},

	_d3_scaleExtent: function _d3_scaleExtent(domain) {
		var start = domain[0],
		    stop = domain[domain.length - 1];
		return start < stop ? [start, stop] : [stop, start];
	},

	_d3_scaleRange: function _d3_scaleRange(scale) {
		return scale.rangeExtent ? scale.rangeExtent() : this._d3_scaleExtent(scale.range());
	}
});

module.exports = Axis;

},{"./D3Provider":8,"./ReactProvider":15}],5:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Bar = React.createClass({
	displayName: "Bar",

	propTypes: {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		x: React.PropTypes.number.isRequired,
		y: React.PropTypes.number.isRequired,
		fill: React.PropTypes.string.isRequired,
		data: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]).isRequired,
		onMouseEnter: React.PropTypes.func,
		onMouseLeave: React.PropTypes.func
	},

	render: function render() {
		var _props = this.props;
		var x = _props.x;
		var y = _props.y;
		var width = _props.width;
		var height = _props.height;
		var fill = _props.fill;
		var data = _props.data;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		return React.createElement("rect", {
			className: "bar",
			x: x,
			y: y,
			width: width,
			height: height,
			fill: fill,
			onMouseMove: function (e) {
				onMouseEnter(e, data);
			},
			onMouseLeave: function (e) {
				onMouseLeave(e);
			}
		});
	}
});

module.exports = Bar;

},{"./D3Provider":8,"./ReactProvider":15}],6:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

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
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		var bars = data.map(function (stack) {
			return values(stack).map(function (e) {
				return React.createElement(Bar, {
					width: xScale.rangeBand(),
					height: yScale(yScale.domain()[0]) - yScale(y(e)),
					x: xScale(x(e)),
					y: yScale(y0(e) + y(e)),
					fill: colorScale(label(stack)),
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

var BarChart = React.createClass({
	displayName: "BarChart",

	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, StackAccessorMixin, StackDataMixin, DefaultScalesMixin, TooltipMixin],

	getDefaultProps: function getDefaultProps() {
		return {};
	},

	_tooltipHtml: function _tooltipHtml(d, position) {
		return this.props.tooltipHtml(this.props.x(d), this.props.y0(d), this.props.y(d));
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
		var data = this._data;
		var innerWidth = this._innerWidth;
		var innerHeight = this._innerHeight;
		var xScale = this._xScale;
		var yScale = this._yScale;

		return React.createElement(
			"div",
			null,
			React.createElement(
				Chart,
				{ height: height, width: width, margin: margin },
				React.createElement(DataSet, {
					data: data,
					xScale: xScale,
					yScale: yScale,
					colorScale: colorScale,
					values: values,
					label: label,
					y: y,
					y0: y0,
					x: x,
					onMouseEnter: this.onMouseEnter,
					onMouseLeave: this.onMouseLeave
				}),
				React.createElement(Axis, _extends({
					className: "x axis",
					orientation: "bottom",
					scale: xScale,
					height: innerHeight,
					width: innerWidth
				}, xAxis)),
				React.createElement(Axis, _extends({
					className: "y axis",
					orientation: "left",
					scale: yScale,
					height: innerHeight,
					width: innerWidth
				}, yAxis))
			),
			React.createElement(Tooltip, {
				hidden: this.state.tooltip.hidden,
				top: this.state.tooltip.top,
				left: this.state.tooltip.left,
				html: this.state.tooltip.html })
		);
	}
});

module.exports = BarChart;

},{"./ArrayifyMixin":3,"./Axis":4,"./Bar":5,"./Chart":7,"./D3Provider":8,"./DefaultPropsMixin":9,"./DefaultScalesMixin":10,"./HeightWidthMixin":11,"./ReactProvider":15,"./StackAccessorMixin":17,"./StackDataMixin":18,"./Tooltip":19,"./TooltipMixin":20}],7:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");

var Chart = React.createClass({
	displayName: "Chart",

	propTypes: {
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		margin: React.PropTypes.shape({
			top: React.PropTypes.number,
			bottom: React.PropTypes.number,
			left: React.PropTypes.number,
			right: React.PropTypes.number
		}).isRequired
	},

	render: function render() {
		var _props = this.props;
		var width = _props.width;
		var height = _props.height;
		var margin = _props.margin;
		var children = _props.children;

		return React.createElement(
			"svg",
			{ ref: "svg", width: width, height: height },
			React.createElement(
				"g",
				{ transform: "translate(" + margin.left + ", " + margin.top + ")" },
				children
			)
		);
	}
});

module.exports = Chart;

},{"./ReactProvider":15}],8:[function(require,module,exports){
"use strict";

var d3 = window.d3 || require("d3");

module.exports = d3;

},{"d3":undefined}],9:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var DefaultPropsMixin = {
	propTypes: {
		data: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]).isRequired,
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		margin: React.PropTypes.shape({
			top: React.PropTypes.number,
			bottom: React.PropTypes.number,
			left: React.PropTypes.number,
			right: React.PropTypes.number
		}),
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
		colorScale: React.PropTypes.func
	},

	getDefaultProps: function getDefaultProps() {
		return {
			margin: { top: 0, bottom: 0, left: 0, right: 0 },
			xScale: null,
			yScale: null,
			colorScale: d3.scale.category20()
		};
	}
};

module.exports = DefaultPropsMixin;

},{"./D3Provider":8,"./ReactProvider":15}],10:[function(require,module,exports){
"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var DefaultScalesMixin = {
	propTypes: {
		barPadding: React.PropTypes.number
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
		var xScale = props.xScale;
		var xIntercept = props.xIntercept;
		var yScale = props.yScale;
		var yIntercept = props.yIntercept;

		if (!xScale) {
			var _ref = this._makeXScale();

			var _ref2 = _slicedToArray(_ref, 2);

			this._xScale = _ref2[0];
			this._xIntercept = _ref2[1];
		} else {
			var _ref3 = [xScale, xIntercept];

			var _ref32 = _slicedToArray(_ref3, 2);

			this._xScale = _ref32[0];
			this._xIntercept = _ref32[1];
		}

		if (!this.props.yScale) {
			var _ref4 = this._makeYScale();

			var _ref42 = _slicedToArray(_ref4, 2);

			this._yScale = _ref42[0];
			this._yIntercept = _ref42[1];
		} else {
			var _ref5 = [yScale, yIntercept];

			var _ref52 = _slicedToArray(_ref5, 2);

			this._yScale = _ref52[0];
			this._yIntercept = _ref52[1];
		}
	},

	_makeXScale: function _makeXScale() {
		var _props = this.props;
		var x = _props.x;
		var values = _props.values;

		var data = this._data;

		if (Number.isFinite(x(values(data[0])[0]))) {
			return this._makeLinearXScale();
		} else {
			return this._makeOrdinalXScale();
		}
	},

	_makeLinearXScale: function _makeLinearXScale() {
		var _props = this.props;
		var x = _props.x;
		var values = _props.values;
		var data = this._data;
		var innerWidth = this._innerWidth;

		var extents = d3.extent(Array.prototype.concat.apply([], data.map(function (stack) {
			return values(stack).map(function (e) {
				return x(e);
			});
		})));

		var scale = d3.scale.linear().domain(extents).range([0, innerWidth]);

		var zero = d3.max([0, scale.domain()[0]]);
		var xIntercept = scale(zero);

		return [scale, xIntercept];
	},

	_makeOrdinalXScale: function _makeOrdinalXScale() {
		var _props = this.props;
		var x = _props.x;
		var values = _props.values;
		var barPadding = _props.barPadding;
		var data = this._data;
		var innerWidth = this._innerWidth;

		var scale = d3.scale.ordinal().domain(values(data[0]).map(function (e) {
			return x(e);
		})).rangeRoundBands([0, innerWidth], barPadding);

		return [scale, 0];
	},

	_makeYScale: function _makeYScale() {
		var _props = this.props;
		var y = _props.y;
		var values = _props.values;

		var data = this._data;

		if (Number.isFinite(y(values(data[0])[0]))) {
			return this._makeLinearYScale();
		} else {
			return this._makeOrdinalYScale();
		}
	},

	_makeLinearYScale: function _makeLinearYScale() {
		var _props = this.props;
		var y = _props.y;
		var y0 = _props.y0;
		var values = _props.values;
		var data = this._data;
		var innerHeight = this._innerHeight;

		var extents = d3.extent(Array.prototype.concat.apply([], data.map(function (stack) {
			return values(stack).map(function (e) {
				return y0(e) + y(e);
			});
		})));

		extents = [d3.min([0, extents[0]]), extents[1]];

		var scale = d3.scale.linear().domain(extents).range([innerHeight, 0]);

		var zero = d3.max([0, scale.domain()[0]]);
		var yIntercept = scale(zero);

		return [scale, yIntercept];
	},

	_makeOrdinalYScale: function _makeOrdinalYScale() {
		return [null, 0];
	}
};

module.exports = DefaultScalesMixin;

},{"./D3Provider":8,"./ReactProvider":15}],11:[function(require,module,exports){
"use strict";

var HeightWidthMixin = {
	componentWillMount: function componentWillMount() {
		this._calculateInner(this.props);
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this._calculateInner(nextProps);
	},

	_calculateInner: function _calculateInner(props) {
		var _props = this.props;
		var height = _props.height;
		var width = _props.width;
		var margin = _props.margin;

		this._innerHeight = height - margin.top - margin.bottom;
		this._innerWidth = width - margin.left - margin.right;
	}
};

module.exports = HeightWidthMixin;

},{}],12:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

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
		var colorScale = _props.colorScale;
		var values = _props.values;
		var label = _props.label;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		var lines = data.map(function (stack) {
			return React.createElement(Path, {
				className: "line",
				d: line(values(stack)),
				stroke: colorScale(label(stack)),
				data: values(stack),
				onMouseEnter: onMouseEnter,
				onMouseLeave: onMouseLeave
			});
		});

		/*
   The <rect> below is needed in case we want to show the tooltip no matter where on the chart the mouse is.
   Not sure if this should be used.
   */
		/*
  <rect width={width} height={height} fill={"none"} stroke={"none"} style={{pointerEvents: "all"}}
  	onMouseMove={ evt => { onMouseEnter(evt, data); } }
  	onMouseLeave={  evt => { onMouseLeave(evt); } }
  		/>
   */
		return React.createElement(
			"g",
			null,
			lines
		);
	}
});

var LineChart = React.createClass({
	displayName: "LineChart",

	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, AccessorMixin, DefaultScalesMixin, TooltipMixin],

	propTypes: {
		interpolate: React.PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			interpolate: "linear"
		};
	},

	/*
  The code below supports finding the data values for the line closest to the mouse cursor.
  Since it gets all events from the Rect overlaying the Chart the tooltip gets shown everywhere.
  For now I don't want to use this method.
  */
	/*
  tooltipHtml: (d, position, xScale, yScale) => {
  let xValueCursor = xScale.invert(position[0]);
  let yValueCursor = yScale.invert(position[1]);
 	 let xBisector = d3.bisector(e => { return e.x; }).left;
  let valuesAtX = d.map(stack => {
  let idx = xBisector(stack.values, xValueCursor);
  return stack.values[idx];
  });
 	 valuesAtX.sort((a, b) => { return a.y - b.y; });
 	 let yBisector = d3.bisector(e => { return e.y; }).left;
  let yIndex = yBisector(valuesAtX, yValueCursor);
 	 let yValue = valuesAtX[yIndex == valuesAtX.length ? yIndex - 1 : yIndex].y;
 	 return `Value: ${yValue}`;
  }
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
		var xIndex = xBisector(data, xScale.invert(position[0]));

		var indexRight = xIndex == data.length ? xIndex - 1 : xIndex;
		var valueRight = x(data[indexRight]);

		var indexLeft = xIndex == 0 ? xIndex : xIndex - 1;
		var valueLeft = x(data[indexLeft]);

		var index = undefined;
		if (Math.abs(xValueCursor - valueRight) < Math.abs(xValueCursor - valueLeft)) {
			index = indexRight;
		} else {
			index = indexLeft;
		}

		var yValue = y(data[index]);
		var cursorValue = d3.round(yScale.invert(position[1]), 2);

		return this.props.tooltipHtml(yValue, cursorValue);
	},

	render: function render() {
		var _props = this.props;
		var height = _props.height;
		var width = _props.width;
		var margin = _props.margin;
		var colorScale = _props.colorScale;
		var interpolate = _props.interpolate;
		var strokeWidth = _props.strokeWidth;
		var stroke = _props.stroke;
		var values = _props.values;
		var label = _props.label;
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

		var line = d3.svg.line().x(function (e) {
			return xScale(x(e));
		}).y(function (e) {
			return yScale(y(e));
		}).interpolate(interpolate);

		return React.createElement(
			"div",
			null,
			React.createElement(
				Chart,
				{ height: height, width: width, margin: margin },
				React.createElement(DataSet, {
					height: innerHeight,
					width: innerWidth,
					data: data,
					line: line,
					strokeWidth: strokeWidth,
					stroke: stroke,
					colorScale: colorScale,
					values: values,
					label: label,
					onMouseEnter: this.onMouseEnter,
					onMouseLeave: this.onMouseLeave
				}),
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
				}, yAxis))
			),
			React.createElement(Tooltip, {
				hidden: this.state.tooltip.hidden,
				top: this.state.tooltip.top,
				left: this.state.tooltip.left,
				html: this.state.tooltip.html })
		);
	}
});

module.exports = LineChart;

},{"./AccessorMixin":1,"./ArrayifyMixin":3,"./Axis":4,"./Chart":7,"./D3Provider":8,"./DefaultPropsMixin":9,"./DefaultScalesMixin":10,"./HeightWidthMixin":11,"./Path":13,"./ReactProvider":15,"./Tooltip":19,"./TooltipMixin":20}],13:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Path = React.createClass({
	displayName: "Path",

	propTypes: {
		className: React.PropTypes.string,
		stroke: React.PropTypes.string.isRequired,
		fill: React.PropTypes.string,
		d: React.PropTypes.string.isRequired,
		data: React.PropTypes.array.isRequired
	},

	getDefaultProps: function getDefaultProps() {
		return {
			className: "path",
			fill: "none"
		};
	},

	render: function render() {
		var _props = this.props;
		var className = _props.className;
		var stroke = _props.stroke;
		var fill = _props.fill;
		var d = _props.d;
		var data = _props.data;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		return React.createElement("path", {
			className: className,
			strokeWidth: "2",
			stroke: stroke,
			fill: fill,
			d: d,
			onMouseMove: function (evt) {
				onMouseEnter(evt, data);
			},
			onMouseLeave: function (evt) {
				onMouseLeave(evt);
			}
		});
	}
});

module.exports = Path;

},{"./D3Provider":8,"./ReactProvider":15}],14:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Chart = require("./Chart");
var Tooltip = require("./Tooltip");

var DefaultPropsMixin = require("./DefaultPropsMixin");
var HeightWidthMixin = require("./HeightWidthMixin");
var AccessorMixin = require("./AccessorMixin");
var TooltipMixin = require("./TooltipMixin");

var Wedge = React.createClass({
	displayName: "Wedge",

	propTypes: {
		d: React.PropTypes.string.isRequired,
		fill: React.PropTypes.string.isRequired
	},

	render: function render() {
		var _props = this.props;
		var fill = _props.fill;
		var d = _props.d;
		var data = _props.data;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		return React.createElement("path", {
			fill: fill,
			d: d,
			onMouseMove: function (evt) {
				onMouseEnter(evt, data);
			},
			onMouseLeave: function (evt) {
				onMouseLeave(evt);
			}
		});
	}
});

var DataSet = React.createClass({
	displayName: "DataSet",

	propTypes: {
		pie: React.PropTypes.array.isRequired,
		arc: React.PropTypes.func.isRequired,
		outerArc: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired,
		radius: React.PropTypes.number.isRequired,
		strokeWidth: React.PropTypes.number,
		stroke: React.PropTypes.string,
		fill: React.PropTypes.string,
		opacity: React.PropTypes.number,
		x: React.PropTypes.func.isRequired
	},

	getDefaultProps: function getDefaultProps() {
		return {
			strokeWidth: 2,
			stroke: "#000",
			fill: "none",
			opacity: 0.3
		};
	},

	render: function render() {
		var _props = this.props;
		var pie = _props.pie;
		var arc = _props.arc;
		var outerArc = _props.outerArc;
		var colorScale = _props.colorScale;
		var radius = _props.radius;
		var strokeWidth = _props.strokeWidth;
		var stroke = _props.stroke;
		var fill = _props.fill;
		var opacity = _props.opacity;
		var x = _props.x;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		var wedges = pie.map(function (e) {
			function midAngle(d) {
				return d.startAngle + (d.endAngle - d.startAngle) / 2;
			}

			var d = arc(e);

			var labelPos = outerArc.centroid(e);
			labelPos[0] = radius * (midAngle(e) < Math.PI ? 1 : -1);

			var textAnchor = midAngle(e) < Math.PI ? "start" : "end";

			var linePos = outerArc.centroid(e);
			linePos[0] = radius * 0.95 * (midAngle(e) < Math.PI ? 1 : -1);

			return React.createElement(
				"g",
				{ className: "arc" },
				React.createElement(Wedge, {
					data: e.data,
					fill: colorScale(x(e.data)),
					d: d,
					onMouseEnter: onMouseEnter,
					onMouseLeave: onMouseLeave
				}),
				React.createElement("polyline", {
					opacity: opacity,
					strokeWidth: strokeWidth,
					stroke: stroke,
					fill: fill,
					points: [arc.centroid(e), outerArc.centroid(e), linePos]
				}),
				React.createElement(
					"text",
					{
						dy: ".35em",
						x: labelPos[0],
						y: labelPos[1],
						textAnchor: textAnchor },
					x(e.data)
				)
			);
		});

		return React.createElement(
			"g",
			null,
			wedges
		);
	}
});

var PieChart = React.createClass({
	displayName: "PieChart",

	mixins: [DefaultPropsMixin, HeightWidthMixin, AccessorMixin, TooltipMixin],

	propTypes: {
		innerRadius: React.PropTypes.number,
		outerRadius: React.PropTypes.number,
		labelRadius: React.PropTypes.number,
		padRadius: React.PropTypes.string,
		cornerRadius: React.PropTypes.number
	},

	getDefaultProps: function getDefaultProps() {
		return {
			innerRadius: null,
			outerRadius: null,
			labelRadius: null,
			padRadius: "auto",
			cornerRadius: 0
		};
	},

	_tooltipHtml: function _tooltipHtml(d, position) {
		return this.props.tooltipHtml(this.props.x(d), this.props.y(d));
	},

	render: function render() {
		var _props = this.props;
		var data = _props.data;
		var width = _props.width;
		var height = _props.height;
		var margin = _props.margin;
		var colorScale = _props.colorScale;
		var innerRadius = _props.innerRadius;
		var outerRadius = _props.outerRadius;
		var labelRadius = _props.labelRadius;
		var padRadius = _props.padRadius;
		var cornerRadius = _props.cornerRadius;
		var x = _props.x;
		var y = _props.y;
		var values = _props.values;
		var innerWidth = this._innerWidth;
		var innerHeight = this._innerHeight;

		var pie = d3.layout.pie().value(function (e) {
			return y(e);
		});

		var radius = Math.min(innerWidth, innerHeight) / 2;
		if (!innerRadius) {
			innerRadius = radius * 0.8;
		}

		if (!outerRadius) {
			outerRadius = radius * 0.4;
		}

		if (!labelRadius) {
			labelRadius = radius * 0.9;
		}

		var arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius).padRadius(padRadius).cornerRadius(cornerRadius);

		var outerArc = d3.svg.arc().innerRadius(labelRadius).outerRadius(labelRadius);

		var pieData = pie(values(data));

		var translation = "translate(" + innerWidth / 2 + ", " + innerHeight / 2 + ")";
		return React.createElement(
			"div",
			null,
			React.createElement(
				Chart,
				{ height: height, width: width, margin: margin },
				React.createElement(
					"g",
					{ transform: translation },
					React.createElement(DataSet, {
						width: innerWidth,
						height: innerHeight,
						colorScale: colorScale,
						pie: pieData,
						arc: arc,
						outerArc: outerArc,
						radius: radius,
						x: x,
						onMouseEnter: this.onMouseEnter,
						onMouseLeave: this.onMouseLeave
					})
				)
			),
			React.createElement(Tooltip, {
				hidden: this.state.tooltip.hidden,
				top: this.state.tooltip.top,
				left: this.state.tooltip.left,
				html: this.state.tooltip.html })
		);
	}
});

module.exports = PieChart;

},{"./AccessorMixin":1,"./Chart":7,"./D3Provider":8,"./DefaultPropsMixin":9,"./HeightWidthMixin":11,"./ReactProvider":15,"./Tooltip":19,"./TooltipMixin":20}],15:[function(require,module,exports){
"use strict";

var React = window.React || require("react");

module.exports = React;

},{"react":undefined}],16:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

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
		var values = _props.values;
		var x = _props.x;
		var y = _props.y;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		var circles = data.map(function (stack) {
			return values(stack).map(function (e) {
				var translate = "translate(" + xScale(x(e)) + ", " + yScale(y(e)) + ")";
				return React.createElement("path", {
					className: "dot",
					d: symbol(),
					transform: translate,
					fill: colorScale(stack.label),
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
		return this.props.tooltipHtml(this.props.x(d), this.props.y(d));
	},

	render: function render() {
		var _props = this.props;
		var height = _props.height;
		var width = _props.width;
		var margin = _props.margin;
		var colorScale = _props.colorScale;
		var rScale = _props.rScale;
		var shape = _props.shape;
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
					values: values,
					x: x,
					y: y,
					onMouseEnter: this.onMouseEnter,
					onMouseLeave: this.onMouseLeave
				})
			),
			React.createElement(Tooltip, {
				hidden: this.state.tooltip.hidden,
				top: this.state.tooltip.top,
				left: this.state.tooltip.left,
				html: this.state.tooltip.html })
		);
	}
});

module.exports = ScatterPlot;

},{"./AccessorMixin":1,"./ArrayifyMixin":3,"./Axis":4,"./Chart":7,"./D3Provider":8,"./DefaultPropsMixin":9,"./DefaultScalesMixin":10,"./HeightWidthMixin":11,"./ReactProvider":15,"./Tooltip":19,"./TooltipMixin":20}],17:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");

var StackAccessorMixin = {
	propTypes: {
		label: React.PropTypes.func,
		values: React.PropTypes.func,
		x: React.PropTypes.func,
		y: React.PropTypes.func,
		y0: React.PropTypes.func
	},

	getDefaultProps: function getDefaultProps() {
		return {
			label: function (stack) {
				return stack.label;
			},
			values: function (stack) {
				return stack.values;
			},
			x: function (e) {
				return e.x;
			},
			y: function (e) {
				return e.y;
			},
			y0: function (e) {
				return e.y0;
			}
		};
	}
};

module.exports = StackAccessorMixin;

},{"./ReactProvider":15}],18:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var StackDataMixin = {
	propTypes: {
		offset: React.PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			offset: "zero",
			order: "default"
		};
	},

	componentWillMount: function componentWillMount() {
		this._stackData(this.props);
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this._stackData(nextProps);
	},

	_stackData: function _stackData(props) {
		var _props = this.props;
		var offset = _props.offset;
		var order = _props.order;
		var x = _props.x;
		var y = _props.y;
		var values = _props.values;

		var stack = d3.layout.stack().offset(offset).order(order).x(x).y(y).values(values);

		this._data = stack(this._data);
	}
};

module.exports = StackDataMixin;

},{"./D3Provider":8,"./ReactProvider":15}],19:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Tooltip = React.createClass({
	displayName: "Tooltip",

	propTypes: {
		top: React.PropTypes.number.isRequired,
		left: React.PropTypes.number.isRequired,
		html: React.PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			top: 150,
			left: 100,
			html: ""
		};
	},

	render: function render() {
		var _props = this.props;
		var top = _props.top;
		var left = _props.left;
		var hidden = _props.hidden;
		var html = _props.html;

		var style = {
			display: hidden ? "none" : "flex",
			position: "absolute",
			top: top,
			left: left
		};

		return React.createElement(
			"div",
			{ className: "tooltip", style: style },
			html
		);
	}
});

module.exports = Tooltip;

},{"./D3Provider":8,"./ReactProvider":15}],20:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var TooltipMixin = {
	propTypes: {
		tooltipHtml: React.PropTypes.func
	},

	getInitialState: function getInitialState() {
		return {
			tooltip: {
				hidden: true
			}
		};
	},

	getDefaultProps: function getDefaultProps() {
		return {
			tooltipOffset: { top: -20, left: 15 },
			tooltipHtml: null
		};
	},

	componentDidMount: function componentDidMount() {
		this._svg_node = this.getDOMNode().getElementsByTagName("svg")[0];
	},

	onMouseEnter: function onMouseEnter(e, data) {
		if (!this.props.tooltipHtml) {
			return;
		}

		var _props = this.props;
		var margin = _props.margin;
		var xScale = _props.xScale;
		var yScale = _props.yScale;
		var tooltipHtml = _props.tooltipHtml;

		var svg = this._svg_node;
		var position = undefined;
		if (svg.createSVGPoint) {
			var point = svg.createSVGPoint();
			point.x = e.clientX, point.y = e.clientY;
			point = point.matrixTransform(svg.getScreenCTM().inverse());
			position = [point.x - margin.left, point.y - margin.top];
		} else {
			var rect = svg.getBoundingClientRect();
			position = [e.clientX - rect.left - svg.clientLeft - margin.left, e.clientY - rect.top - svg.clientTop - margin.top];
		}

		this.setState({
			tooltip: {
				top: e.pageY + this.props.tooltipOffset.top,
				left: e.pageX + this.props.tooltipOffset.left,
				hidden: false,
				html: this._tooltipHtml(data, position)
			}
		});
	},

	onMouseLeave: function onMouseLeave(e) {
		if (!this.props.tooltipHtml) {
			return;
		}

		this.setState({
			tooltip: {
				hidden: true
			}
		});
	}
};

module.exports = TooltipMixin;

},{"./D3Provider":8,"./ReactProvider":15}],21:[function(require,module,exports){
"use strict";

var BarChart = require("./BarChart");
var PieChart = require("./PieChart");
var ScatterPlot = require("./ScatterPlot");
var LineChart = require("./LineChart");
var AreaChart = require("./AreaChart");

module.exports = {
    BarChart: BarChart,
    PieChart: PieChart,
    ScatterPlot: ScatterPlot,
    LineChart: LineChart,
    AreaChart: AreaChart
};

},{"./AreaChart":2,"./BarChart":6,"./LineChart":12,"./PieChart":14,"./ScatterPlot":16}]},{},[21])(21)
});