"use strict";

var React = require("react");

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
        var viewBox = _props.viewBox;
        var preserveAspectRatio = _props.preserveAspectRatio;
        var children = _props.children;

        return React.createElement(
            "svg",
            { ref: "svg", width: width, height: height, viewBox: viewBox, preserveAspectRatio: preserveAspectRatio },
            React.createElement(
                "g",
                { transform: "translate(" + margin.left + ", " + margin.top + ")" },
                children
            )
        );
    }
});

module.exports = Chart;