"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var React = require("react");
var ReactDOM = require("react-dom");
var d3 = require("d3");

var TooltipMixin = {
    propTypes: {
        tooltipHtml: React.PropTypes.func,
        tooltipMode: React.PropTypes.oneOf(["mouse", "element", "fixed"]),
        tooltipContained: React.PropTypes.bool,
        tooltipOffset: React.PropTypes.objectOf(React.PropTypes.number)
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
            tooltipMode: "mouse",
            tooltipOffset: { top: -35, left: 0 },
            tooltipHtml: null,
            tooltipContained: false
        };
    },

    componentDidMount: function componentDidMount() {
        this._svg_node = ReactDOM.findDOMNode(this).getElementsByTagName("svg")[0];
    },

    onMouseEnter: function onMouseEnter(e, data) {
        if (!this.props.tooltipHtml) {
            return;
        }

        e.preventDefault();

        var _props = this.props;
        var margin = _props.margin;
        var tooltipMode = _props.tooltipMode;
        var tooltipOffset = _props.tooltipOffset;
        var tooltipContained = _props.tooltipContained;

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

        var _tooltipHtml = this._tooltipHtml(data, position);

        var _tooltipHtml2 = _slicedToArray(_tooltipHtml, 3);

        var html = _tooltipHtml2[0];
        var xPos = _tooltipHtml2[1];
        var yPos = _tooltipHtml2[2];

        var svgTop = svg.getBoundingClientRect().top + margin.top;
        var svgLeft = svg.getBoundingClientRect().left + margin.left;

        var top = 0;
        var left = 0;

        if (tooltipMode === "fixed") {
            top = svgTop + tooltipOffset.top;
            left = svgLeft + tooltipOffset.left;
        } else if (tooltipMode === "element") {
            top = svgTop + yPos + tooltipOffset.top;
            left = svgLeft + xPos + tooltipOffset.left;
        } else {
            // mouse
            top = e.clientY + tooltipOffset.top;
            left = e.clientX + tooltipOffset.left;
        }

        function lerp(t, a, b) {
            return (1 - t) * a + t * b;
        }

        var translate = 50;

        if (tooltipContained) {
            var t = position[0] / svg.getBoundingClientRect().width;
            translate = lerp(t, 0, 100);
        }

        this.setState({
            tooltip: {
                top: top,
                left: left,
                hidden: false,
                html: html,
                translate: translate
            }
        });
    },

    onMouseLeave: function onMouseLeave(e) {
        if (!this.props.tooltipHtml) {
            return;
        }

        e.preventDefault();

        this.setState({
            tooltip: {
                hidden: true
            }
        });
    }
};

module.exports = TooltipMixin;