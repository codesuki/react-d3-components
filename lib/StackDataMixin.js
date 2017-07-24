'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var string = _react.PropTypes.string;


var StackDataMixin = {
    propTypes: {
        offset: string
    },

    getDefaultProps: function getDefaultProps() {
        return {
            offset: 'zero',
            order: 'default'
        };
    },
    componentWillMount: function componentWillMount() {
        this._stackData(this.props);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this._stackData(nextProps);
    },
    _stackData: function _stackData(props) {
        var offset = props.offset,
            order = props.order,
            x = props.x,
            y = props.y,
            values = props.values;


        var stack = _d2.default.layout.stack().offset(offset).order(order).x(x).y(y).values(values);

        this._data = stack(this._data);
    }
};

exports.default = StackDataMixin;