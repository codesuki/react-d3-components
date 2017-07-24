"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var HeightWidthMixin = {
    componentWillMount: function componentWillMount() {
        this._calculateInner(this.props);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this._calculateInner(nextProps);
    },
    _calculateInner: function _calculateInner(props) {
        var height = props.height,
            width = props.width,
            margin = props.margin;


        this._innerHeight = height - margin.top - margin.bottom;
        this._innerWidth = width - margin.left - margin.right;
    }
};

exports.default = HeightWidthMixin;