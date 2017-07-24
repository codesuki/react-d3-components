"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var number = _react.PropTypes.number,
    string = _react.PropTypes.string,
    array = _react.PropTypes.array,
    object = _react.PropTypes.object,
    func = _react.PropTypes.func,
    oneOfType = _react.PropTypes.oneOfType;


var Bar = _react2.default.createClass({
    displayName: "Bar",

    propTypes: {
        width: number.isRequired,
        height: number.isRequired,
        x: number.isRequired,
        y: number.isRequired,
        fill: string.isRequired,
        data: oneOfType([array, object]).isRequired,
        onMouseEnter: func,
        onMouseLeave: func,
        onMouseClick: func
    },

    render: function render() {
        var _props = this.props,
            x = _props.x,
            y = _props.y,
            width = _props.width,
            height = _props.height,
            fill = _props.fill,
            data = _props.data,
            onMouseEnter = _props.onMouseEnter,
            _onMouseLeave = _props.onMouseLeave,
            onMouseClick = _props.onMouseClick;


        return _react2.default.createElement("rect", {
            className: "bar",
            x: x,
            y: y,
            width: width,
            height: height,
            fill: fill,
            onMouseMove: function onMouseMove(e) {
                return onMouseEnter(e, data);
            },
            onMouseLeave: function onMouseLeave(e) {
                return _onMouseLeave(e);
            },
            onClick: function onClick(e) {
                onMouseClick && onMouseClick(e, data);
            }
        });
    }
});

exports.default = Bar;