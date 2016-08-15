"use strict";

var ArrayifyMixin = {
    componentWillMount: function componentWillMount() {
        this._arrayify(this.props);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this._arrayify(nextProps);
    },

    _arrayify: function _arrayify(props) {
        if (props.data === null) {
            this._data = [{
                label: "No data available",
                values: [{ x: "No data available", y: 1 }]
            }];
        } else if (!Array.isArray(props.data)) {
            this._data = [props.data];
        } else {
            this._data = props.data;
        }
    }
};

module.exports = ArrayifyMixin;