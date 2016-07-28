"use strict";

var React = require("react");
var d3 = require("d3");

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
            tickFormat: null,
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

        if (!tickFormat) {
            if (scale.tickFormat) {
                tickFormat = scale.tickFormat.apply(scale, tickArguments);
            } else {
                tickFormat = function (x) {
                    return x;
                };
            }
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

        var tickElements = ticks.map(function (tick, index) {
            var position = activeScale(tick);
            var translate = transform.replace("{}", position);
            return React.createElement(
                "g",
                { key: "" + tick + "." + index, className: "tick", transform: translate },
                React.createElement("line", { x2: x2, y2: y2, stroke: "#aaa" }),
                React.createElement(
                    "text",
                    { x: x, y: y, dy: dy, textAnchor: textAnchor },
                    tickFormat(tick)
                )
            );
        });

        var pathElement = React.createElement("path", { className: "domain", d: d, fill: "none", stroke: "#aaa" });

        var axisBackground = React.createElement("rect", { className: "axis-background", fill: "none" });

        return React.createElement(
            "g",
            { ref: "axis", className: className, transform: this._getTranslateString(), style: { shapeRendering: "crispEdges" } },
            axisBackground,
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