"use strict";

var HeightWidthMixin = {
    componentWillMount: function componentWillMount() {
        this._calculateInner(this.props);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this._calculateInner(nextProps);
    },

    _calculateInner: function _calculateInner(props) {
        var height = props.height;
        var width = props.width;
        var margin = props.margin;

        this._innerHeight = height - margin.top - margin.bottom;
        this._innerWidth = width - margin.left - margin.right;
    }
};

module.exports = HeightWidthMixin;