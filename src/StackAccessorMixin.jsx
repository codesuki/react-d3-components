import PropTypes from 'prop-types';

const { func } = PropTypes;

const StackAccessorMixin = {
    propTypes: {
        label: func,
        values: func,
        x: func,
        y: func,
        y0: func
    },

    getDefaultProps() {
        return {
            label: stack => stack.label,
            values: stack => stack.values,
            x: e => e.x,
            y: e => e.y,
            y0: e => e.y0
        };
    }
};

export default StackAccessorMixin;
