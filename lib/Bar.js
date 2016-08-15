"use strict";

var React = require("react");
var d3 = require("d3");

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