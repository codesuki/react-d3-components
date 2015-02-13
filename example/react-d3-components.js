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

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Chart = require("./Chart");
var Axis = require("./Axis");
var Path = require("./Path");

var DefaultPropsMixin = require("./DefaultPropsMixin");
var HeightWidthMixin = require("./HeightWidthMixin");
var ArrayifyMixin = require("./ArrayifyMixin");
var StackAccessorMixin = require("./StackAccessorMixin");
var StackDataMixin = require("./StackDataMixin");
var DefaultScalesMixin = require("./DefaultScalesMixin");

var DataSet = React.createClass({ displayName: "DataSet",
	propTypes: {
		data: React.PropTypes.array.isRequired,
		area: React.PropTypes.func.isRequired,
		line: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired,
		stroke: React.PropTypes.func.isRequired
	},

	render: function render() {
		var data = this.props.data;
		var area = this.props.area;
		var line = this.props.line;
		var colorScale = this.props.colorScale;
		var stroke = this.props.stroke;
		var values = this.props.values;
		var label = this.props.label;


		var areas = data.map(function (stack) {
			return React.createElement(Path, { className: "area", stroke: "none", fill: colorScale(label(stack)), d: area(values(stack)) });
		});

		var lines = data.map(function (stack) {
			return React.createElement(Path, { className: "line", d: line(values(stack)), stroke: stroke(label(stack)) });
		});

		return React.createElement("g", null, areas, lines);
	}
});

var AreaChart = React.createClass({ displayName: "AreaChart",
	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, StackAccessorMixin, StackDataMixin, DefaultScalesMixin],

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

	render: function render() {
		var data = this.props.data;
		var height = this.props.height;
		var width = this.props.width;
		var innerHeight = this.props.innerHeight;
		var innerWidth = this.props.innerWidth;
		var margin = this.props.margin;
		var xScale = this.props.xScale;
		var yScale = this.props.yScale;
		var colorScale = this.props.colorScale;
		var interpolate = this.props.interpolate;
		var stroke = this.props.stroke;
		var offset = this.props.offset;
		var xIntercept = this.props.xIntercept;
		var yIntercept = this.props.yIntercept;
		var values = this.props.values;
		var label = this.props.label;
		var x = this.props.x;
		var y = this.props.y;
		var y0 = this.props.y0;


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

		return React.createElement(Chart, { height: height, width: width, margin: margin }, React.createElement(DataSet, {
			data: data,
			line: line,
			area: area,
			colorScale: colorScale,
			stroke: stroke,
			label: label,
			values: values }), React.createElement(Axis, {
			className: "x axis",
			orientation: "bottom",
			scale: xScale,
			height: innerHeight,
			zero: yIntercept }), React.createElement(Axis, {
			className: "y axis",
			orientation: "left",
			scale: yScale,
			width: innerWidth,
			zero: xIntercept }));
	}
});

module.exports = AreaChart;



},{"./ArrayifyMixin":3,"./Axis":4,"./Chart":7,"./D3Provider":8,"./DefaultPropsMixin":9,"./DefaultScalesMixin":10,"./HeightWidthMixin":11,"./Path":13,"./ReactProvider":15,"./StackAccessorMixin":17,"./StackDataMixin":18}],3:[function(require,module,exports){
"use strict";

var ArrayifyMixin = {
	componentWillMount: function componentWillMount() {
		if (!Array.isArray(this.props.data)) {
			this.props.data = [this.props.data];
		}
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {}
};

module.exports = ArrayifyMixin;



},{}],4:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Axis = React.createClass({ displayName: "Axis",
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
		orientation: function (props, propName, componentName) {
			if (["top", "bottom", "left", "right"].indexOf(props[propName]) == -1) {
				return new Error("Not a valid orientation!");
			}
		}
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
			zero: 0
		};
	},

	_getTranslateString: function _getTranslateString() {
		var orientation = this.props.orientation;
		var height = this.props.height;
		var width = this.props.width;
		var zero = this.props.zero;


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
		var height = this.props.height;
		var width = this.props.width;
		var tickArguments = this.props.tickArguments;
		var tickValues = this.props.tickValues;
		var tickFormat = this.props.tickFormat;
		var innerTickSize = this.props.innerTickSize;
		var tickPadding = this.props.tickPadding;
		var outerTickSize = this.props.outerTickSize;
		var scale = this.props.scale;
		var orientation = this.props.orientation;
		var className = this.props.className;
		var zero = this.props.zero;


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
		    d = undefined;
		if (orientation === "bottom" || orientation === "top") {
			transform = "translate({val}, 0)";
			x = 0;
			y = sign * tickSpacing;
			x2 = 0;
			y2 = sign * innerTickSize;
			dy = sign < 0 ? "0em" : ".71em";
			textAnchor = "middle";
			d = "M" + range[0] + ", " + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize;
		} else {
			transform = "translate(0, {val})";
			x = sign * tickSpacing;
			y = 0;
			x2 = sign * innerTickSize;
			y2 = 0;
			dy = ".32em";
			textAnchor = sign < 0 ? "end" : "start";
			d = "M" + sign * outerTickSize + ", " + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize;
		}

		var tickElements = ticks.map(function (tick) {
			var position = activeScale(tick);
			var translate = transform.replace("{val}", position);
			return React.createElement("g", { className: "tick", transform: translate }, React.createElement("line", { x2: x2, y2: y2, stroke: "#aaa" }), React.createElement("text", { x: x, y: y, dy: dy, textAnchor: textAnchor }, tickFormat(tick)));
		});

		var pathElement = React.createElement("path", { className: "domain", d: d, fill: "none", stroke: "#aaa" });

		return React.createElement("g", { ref: "axis", className: className, transform: this._getTranslateString(), style: { shapeRendering: "crispEdges" } }, tickElements, pathElement);
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

var Bar = React.createClass({ displayName: "Bar",
	propTypes: {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		x: React.PropTypes.number.isRequired,
		y: React.PropTypes.number.isRequired,
		fill: React.PropTypes.string.isRequired
	},

	render: function render() {
		var x = this.props.x;
		var y = this.props.y;
		var width = this.props.width;
		var height = this.props.height;
		var fill = this.props.fill;


		return React.createElement("rect", { className: "bar", x: x, y: y, width: width, height: height, fill: fill });
	}
});

module.exports = Bar;



},{"./D3Provider":8,"./ReactProvider":15}],6:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Chart = require("./Chart");
var Axis = require("./Axis");
var Bar = require("./Bar");

var DefaultPropsMixin = require("./DefaultPropsMixin");
var HeightWidthMixin = require("./HeightWidthMixin");
var ArrayifyMixin = require("./ArrayifyMixin");
var StackAccessorMixin = require("./StackAccessorMixin");
var StackDataMixin = require("./StackDataMixin");
var DefaultScalesMixin = require("./DefaultScalesMixin");

var DataSet = React.createClass({ displayName: "DataSet",
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
		var data = this.props.data;
		var xScale = this.props.xScale;
		var yScale = this.props.yScale;
		var colorScale = this.props.colorScale;
		var values = this.props.values;
		var label = this.props.label;
		var x = this.props.x;
		var y = this.props.y;
		var y0 = this.props.y0;


		var bars = data.map(function (stack) {
			return values(stack).map(function (e) {
				return React.createElement(Bar, {
					width: xScale.rangeBand(),
					height: yScale(yScale.domain()[0]) - yScale(y(e)),
					x: xScale(x(e)),
					y: yScale(y0(e) + y(e)),
					fill: colorScale(label(stack)) });
			});
		});

		return React.createElement("g", null, bars);
	}
});

var BarChart = React.createClass({ displayName: "BarChart",
	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, StackAccessorMixin, StackDataMixin, DefaultScalesMixin],

	render: function render() {
		var data = this.props.data;
		var height = this.props.height;
		var width = this.props.width;
		var innerHeight = this.props.innerHeight;
		var innerWidth = this.props.innerWidth;
		var margin = this.props.margin;
		var xScale = this.props.xScale;
		var yScale = this.props.yScale;
		var colorScale = this.props.colorScale;
		var values = this.props.values;
		var label = this.props.label;
		var y = this.props.y;
		var y0 = this.props.y0;
		var x = this.props.x;


		return React.createElement(Chart, { height: height, width: width, margin: margin }, React.createElement(DataSet, {
			data: data,
			xScale: xScale,
			yScale: yScale,
			colorScale: colorScale,
			values: values,
			label: label,
			y: y,
			y0: y0,
			x: x }), React.createElement(Axis, {
			className: "x axis",
			orientation: "bottom",
			scale: xScale,
			height: innerHeight }), React.createElement(Axis, {
			className: "y axis",
			orientation: "left",
			scale: yScale,
			width: innerWidth }));
	}
});

module.exports = BarChart;



},{"./ArrayifyMixin":3,"./Axis":4,"./Bar":5,"./Chart":7,"./D3Provider":8,"./DefaultPropsMixin":9,"./DefaultScalesMixin":10,"./HeightWidthMixin":11,"./ReactProvider":15,"./StackAccessorMixin":17,"./StackDataMixin":18}],7:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");

var Chart = React.createClass({ displayName: "Chart",
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
		var width = this.props.width;
		var height = this.props.height;
		var margin = this.props.margin;
		var children = this.props.children;


		return React.createElement("svg", { ref: "svg", width: width, height: height }, React.createElement("g", { transform: "translate(" + margin.left + ", " + margin.top + ")" }, children));
	}
});

module.exports = Chart;



},{"./ReactProvider":15}],8:[function(require,module,exports){
"use strict";

var d3 = window.d3 || require("./D3Provider");

module.exports = d3;



},{"./D3Provider":8}],9:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var DefaultPropsMixin = {
	propTypes: {
		data: React.PropTypes.array.isRequired,
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

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } };

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
		var xScale = this.props.xScale;
		var yScale = this.props.yScale;
		var x = this.props.x;
		var y = this.props.y;
		var values = this.props.values;


		if (!this.props.xScale) {
			var _ref = this._makeXScale();

			var _ref2 = _slicedToArray(_ref, 2);

			this.props.xScale = _ref2[0];
			this.props.xIntercept = _ref2[1];
		}

		if (!this.props.yScale) {
			var _ref3 = this._makeYScale();

			var _ref32 = _slicedToArray(_ref3, 2);

			this.props.yScale = _ref32[0];
			this.props.yIntercept = _ref32[1];
		}
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {},

	_makeXScale: function _makeXScale() {
		var data = this.props.data;
		var x = this.props.x;
		var values = this.props.values;


		if (Number.isFinite(x(values(data[0])[0]))) {
			return this._makeLinearXScale();
		} else {
			return this._makeOrdinalXScale();
		}
	},

	_makeLinearXScale: function _makeLinearXScale() {
		var data = this.props.data;
		var innerWidth = this.props.innerWidth;
		var x = this.props.x;
		var values = this.props.values;


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
		var data = this.props.data;
		var innerWidth = this.props.innerWidth;
		var x = this.props.x;
		var values = this.props.values;
		var barPadding = this.props.barPadding;


		var scale = d3.scale.ordinal().domain(values(data[0]).map(function (e) {
			return x(e);
		})).rangeRoundBands([0, innerWidth], barPadding);

		return [scale, 0];
	},

	_makeYScale: function _makeYScale() {
		var data = this.props.data;
		var y = this.props.y;
		var values = this.props.values;


		if (Number.isFinite(y(values(data[0])[0]))) {
			return this._makeLinearYScale();
		} else {
			return this._makeOrdinalYScale();
		}
	},

	_makeLinearYScale: function _makeLinearYScale() {
		var data = this.props.data;
		var innerHeight = this.props.innerHeight;
		var y = this.props.y;
		var y0 = this.props.y0;
		var values = this.props.values;


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
		var height = this.props.height;
		var width = this.props.width;
		var margin = this.props.margin;
		this.props.innerHeight = height - margin.top - margin.bottom;
		this.props.innerWidth = width - margin.left - margin.right;
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {}
};

module.exports = HeightWidthMixin;



},{}],12:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Chart = require("./Chart");
var Axis = require("./Axis");
var Path = require("./Path");

var DefaultPropsMixin = require("./DefaultPropsMixin");
var HeightWidthMixin = require("./HeightWidthMixin");
var ArrayifyMixin = require("./ArrayifyMixin");
var AccessorMixin = require("./AccessorMixin");
var DefaultScalesMixin = require("./DefaultScalesMixin");

var DataSet = React.createClass({ displayName: "DataSet",
	propTypes: {
		data: React.PropTypes.array.isRequired,
		line: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired
	},

	render: function render() {
		var data = this.props.data;
		var line = this.props.line;
		var strokeWidth = this.props.strokeWidth;
		var colorScale = this.props.colorScale;
		var values = this.props.values;
		var label = this.props.label;


		var lines = data.map(function (stack) {
			return React.createElement(Path, { className: "line", d: line(values(stack)), stroke: colorScale(label(stack)) });
		});

		return React.createElement("g", null, lines);
	}
});

var LineChart = React.createClass({ displayName: "LineChart",
	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, AccessorMixin, DefaultScalesMixin],

	propTypes: {
		interpolate: React.PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			interpolate: "linear"
		};
	},

	render: function render() {
		var data = this.props.data;
		var height = this.props.height;
		var width = this.props.width;
		var innerHeight = this.props.innerHeight;
		var innerWidth = this.props.innerWidth;
		var margin = this.props.margin;
		var xScale = this.props.xScale;
		var yScale = this.props.yScale;
		var colorScale = this.props.colorScale;
		var interpolate = this.props.interpolate;
		var strokeWidth = this.props.strokeWidth;
		var stroke = this.props.stroke;
		var values = this.props.values;
		var label = this.props.label;
		var x = this.props.x;
		var y = this.props.y;


		var line = d3.svg.line().x(function (e) {
			return xScale(x(e));
		}).y(function (e) {
			return yScale(y(e));
		}).interpolate(interpolate);

		return React.createElement(Chart, { height: height, width: width, margin: margin }, React.createElement(DataSet, {
			data: data,
			line: line,
			strokeWidth: strokeWidth,
			colorScale: colorScale,
			values: values,
			label: label }), React.createElement(Axis, {
			className: "x axis",
			orientation: "bottom",
			scale: xScale,
			height: innerHeight }), React.createElement(Axis, {
			className: "y axis",
			orientation: "left",
			scale: yScale,
			width: innerWidth }));
	}
});

module.exports = LineChart;



},{"./AccessorMixin":1,"./ArrayifyMixin":3,"./Axis":4,"./Chart":7,"./D3Provider":8,"./DefaultPropsMixin":9,"./DefaultScalesMixin":10,"./HeightWidthMixin":11,"./Path":13,"./ReactProvider":15}],13:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Path = React.createClass({ displayName: "Path",
	propTypes: {
		className: React.PropTypes.string,
		stroke: React.PropTypes.string.isRequired,
		fill: React.PropTypes.string,
		d: React.PropTypes.string.isRequired
	},

	getDefaultProps: function getDefaultProps() {
		return {
			className: "path",
			fill: "none"
		};
	},

	render: function render() {
		var className = this.props.className;
		var stroke = this.props.stroke;
		var fill = this.props.fill;
		var d = this.props.d;


		return React.createElement("path", { className: className, strokeWidth: "2", stroke: stroke, fill: fill, d: d });
	}
});

module.exports = Path;



},{"./D3Provider":8,"./ReactProvider":15}],14:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var DefaultPropsMixin = require("./DefaultPropsMixin");
var HeightWidthMixin = require("./HeightWidthMixin");
var AccessorMixin = require("./AccessorMixin");

var Chart = require("./Chart");

var Wedge = React.createClass({ displayName: "Wedge",
	propTypes: {
		d: React.PropTypes.string.isRequired,
		fill: React.PropTypes.string.isRequired
	},

	render: function render() {
		var fill = this.props.fill;
		var d = this.props.d;


		return React.createElement("path", { fill: fill, d: d });
	}
});

var DataSet = React.createClass({ displayName: "DataSet",
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
		var pie = this.props.pie;
		var arc = this.props.arc;
		var outerArc = this.props.outerArc;
		var colorScale = this.props.colorScale;
		var radius = this.props.radius;
		var strokeWidth = this.props.strokeWidth;
		var stroke = this.props.stroke;
		var fill = this.props.fill;
		var opacity = this.props.opacity;
		var x = this.props.x;


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

			return React.createElement("g", { className: "arc" }, React.createElement(Wedge, { fill: colorScale(x(e.data)), d: d }), React.createElement("polyline", { opacity: opacity, strokeWidth: strokeWidth, stroke: stroke, fill: fill, points: [arc.centroid(e), outerArc.centroid(e), linePos] }), React.createElement("text", { dy: ".35em", x: labelPos[0], y: labelPos[1], textAnchor: textAnchor }, x(e.data)));
		});

		return React.createElement("g", null, wedges);
	}
});

var PieChart = React.createClass({ displayName: "PieChart",
	mixins: [DefaultPropsMixin, HeightWidthMixin, AccessorMixin],

	propTypes: {
		innerRadius: React.PropTypes.number,
		outerRadius: React.PropTypes.number,
		labelRadius: React.PropTypes.number,
		padRadius: React.PropTypes.number,
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

	render: function render() {
		var width = this.props.width;
		var height = this.props.height;
		var innerWidth = this.props.innerWidth;
		var innerHeight = this.props.innerHeight;
		var margin = this.props.margin;
		var data = this.props.data;
		var colorScale = this.props.colorScale;
		var innerRadius = this.props.innerRadius;
		var outerRadius = this.props.outerRadius;
		var labelRadius = this.props.labelRadius;
		var padRadius = this.props.padRadius;
		var cornerRadius = this.props.cornerRadius;
		var x = this.props.x;
		var y = this.props.y;


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

		var pieData = pie(data.values);

		var translation = "translate(" + innerWidth / 2 + ", " + innerHeight / 2 + ")";
		return React.createElement(Chart, { height: height, width: width, margin: margin }, React.createElement("g", { transform: translation }, React.createElement(DataSet, { width: innerWidth, height: innerHeight, colorScale: colorScale, pie: pieData, arc: arc, outerArc: outerArc, radius: radius, x: x })));
	}
});

module.exports = PieChart;



},{"./AccessorMixin":1,"./Chart":7,"./D3Provider":8,"./DefaultPropsMixin":9,"./HeightWidthMixin":11,"./ReactProvider":15}],15:[function(require,module,exports){
"use strict";

var React = window.React || require("react");

module.exports = React;



},{"react":undefined}],16:[function(require,module,exports){
"use strict";

var React = require("./ReactProvider");
var d3 = require("./D3Provider");

var Chart = require("./Chart");
var Axis = require("./Axis");

var DefaultPropsMixin = require("./DefaultPropsMixin");
var HeightWidthMixin = require("./HeightWidthMixin");
var ArrayifyMixin = require("./ArrayifyMixin");
var AccessorMixin = require("./AccessorMixin");
var DefaultScalesMixin = require("./DefaultScalesMixin");

var DataSet = React.createClass({ displayName: "DataSet",
	propTypes: {
		data: React.PropTypes.array.isRequired,
		symbol: React.PropTypes.func.isRequired,
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired
	},

	render: function render() {
		var data = this.props.data;
		var symbol = this.props.symbol;
		var xScale = this.props.xScale;
		var yScale = this.props.yScale;
		var colorScale = this.props.colorScale;
		var values = this.props.values;
		var x = this.props.x;
		var y = this.props.y;


		var circles = data.map(function (stack) {
			return values(stack).map(function (e) {
				var translate = "translate(" + xScale(x(e)) + ", " + yScale(y(e)) + ")";
				return React.createElement("path", {
					className: "dot",
					d: symbol(),
					transform: translate,
					fill: colorScale(stack.label) });
			});
		});

		return React.createElement("g", null, circles);
	}
});

var ScatterPlot = React.createClass({ displayName: "ScatterPlot",
	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, AccessorMixin, DefaultScalesMixin],

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

	render: function render() {
		var data = this.props.data;
		var height = this.props.height;
		var width = this.props.width;
		var innerHeight = this.props.innerHeight;
		var innerWidth = this.props.innerWidth;
		var margin = this.props.margin;
		var xScale = this.props.xScale;
		var yScale = this.props.yScale;
		var colorScale = this.props.colorScale;
		var rScale = this.props.rScale;
		var shape = this.props.shape;
		var xIntercept = this.props.xIntercept;
		var yIntercept = this.props.yIntercept;
		var values = this.props.values;
		var x = this.props.x;
		var y = this.props.y;


		var symbol = d3.svg.symbol().type(shape);

		if (rScale) {
			symbol = symbol.size(rScale);
		}

		return React.createElement(Chart, { height: height, width: width, margin: margin }, React.createElement(Axis, {
			orientation: "bottom",
			scale: xScale,
			height: innerHeight,
			zero: yIntercept }), React.createElement(Axis, {
			orientation: "left",
			scale: yScale,
			width: innerWidth,
			zero: xIntercept }), React.createElement(DataSet, {
			data: data,
			xScale: xScale,
			yScale: yScale,
			colorScale: colorScale,
			symbol: symbol,
			values: values,
			x: x,
			y: y }));
	}
});

module.exports = ScatterPlot;



},{"./AccessorMixin":1,"./ArrayifyMixin":3,"./Axis":4,"./Chart":7,"./D3Provider":8,"./DefaultPropsMixin":9,"./DefaultScalesMixin":10,"./HeightWidthMixin":11,"./ReactProvider":15}],17:[function(require,module,exports){
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
			offset: "zero"
		};
	},

	componentWillMount: function componentWillMount() {
		var data = this.props.data;
		var offset = this.props.offset;
		var x = this.props.x;
		var y = this.props.y;
		var values = this.props.values;


		var stack = d3.layout.stack().offset(offset).x(x).y(y).values(values);

		this.props.data = stack(data);
	}
};

module.exports = StackDataMixin;



},{"./D3Provider":8,"./ReactProvider":15}],19:[function(require,module,exports){
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



},{"./AreaChart":2,"./BarChart":6,"./LineChart":12,"./PieChart":14,"./ScatterPlot":16}]},{},[19])(19)
});