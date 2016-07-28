"use strict";

var React = require("react");
var d3 = require("d3");

var Tooltip = React.createClass({
    displayName: "Tooltip",

    propTypes: {
        top: React.PropTypes.number.isRequired,
        left: React.PropTypes.number.isRequired,
        html: React.PropTypes.node,
        translate: React.PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
        return {
            top: 150,
            left: 100,
            html: "",
            translate: 50
        };
    },

    render: function render() {
        var _props = this.props;
        var top = _props.top;
        var left = _props.left;
        var hidden = _props.hidden;
        var html = _props.html;
        var translate = _props.translate;

        var style = this.props.style || {
            display: hidden ? "none" : "block",
            position: "fixed",
            top: top,
            left: left,
            transform: "translate(-" + translate + "%, 0)",
            pointerEvents: "none"
        };

        return React.createElement(
            "div",
            { className: "d3-tooltip", style: style },
            html
        );
    }
});

module.exports = Tooltip;