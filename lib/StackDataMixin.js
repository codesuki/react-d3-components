"use strict";

var React = require("react");
var d3 = require("d3");

var StackDataMixin = {
    propTypes: {
        offset: React.PropTypes.string
    },

    getDefaultProps: function getDefaultProps() {
        return {
            offset: "zero",
            order: "default"
        };
    },

    componentWillMount: function componentWillMount() {
        this._stackData(this.props);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this._stackData(nextProps);
    },

    _stackData: function _stackData(props) {
        var offset = props.offset;
        var order = props.order;
        var x = props.x;
        var y = props.y;
        var values = props.values;

        var stack = d3.layout.stack().offset(offset).order(order).x(x).y(y).values(values);

        this._data = stack(this._data);
    }
};

module.exports = StackDataMixin;