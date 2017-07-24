'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var func = _react.PropTypes.func;


var AccessorMixin = {
    propTypes: {
        label: func,
        values: func,
        x: func,
        y: func,
        y0: func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            label: function label(stack) {
                return stack.label;
            },
            values: function values(stack) {
                return stack.values;
            },
            x: function x(e) {
                return e.x;
            },
            y: function y(e) {
                return e.y;
            },
            y0: function y0() {
                return 0;
            }
        };
    }
};

exports.default = AccessorMixin;