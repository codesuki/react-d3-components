let React = require('react');

let StackAccessorMixin = {
    propTypes: {
        label: React.PropTypes.func,
        values: React.PropTypes.func,
        x: React.PropTypes.func,
        y: React.PropTypes.func,
        y0: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            label: stack => { return stack.label; },
            values: stack => { return stack.values; },
            x: e => { return e.x; },
            y: e => { return e.y; },
            y0: e => { return e.y0; }
        };
    }
};

module.exports = StackAccessorMixin;
