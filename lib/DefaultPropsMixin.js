'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oneOfType = _react.PropTypes.oneOfType,
    object = _react.PropTypes.object,
    array = _react.PropTypes.array,
    shape = _react.PropTypes.shape,
    func = _react.PropTypes.func,
    number = _react.PropTypes.number;


var DefaultPropsMixin = {
    propTypes: {
        data: oneOfType([object, array]).isRequired,
        height: number.isRequired,
        width: number.isRequired,
        margin: shape({
            top: number,
            bottom: number,
            left: number,
            right: number
        }),
        xScale: func,
        yScale: func,
        colorScale: func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            data: { label: 'No data available', values: [{ x: 'No data available', y: 1 }] },
            margin: { top: 0, bottom: 0, left: 0, right: 0 },
            xScale: null,
            yScale: null,
            colorScale: _d2.default.scale.category20()
        };
    }
};

exports.default = DefaultPropsMixin;