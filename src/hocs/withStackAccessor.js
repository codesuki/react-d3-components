import PropTypes from 'prop-types';
import React, { Component } from 'react';

export const defaultProps = {
    label: stack => stack.label,
    values: stack => stack.values,
    x: e => e.x,
    y: e => e.y,
    y0: e => e.y0
};

export const withStackAccessor = WrappedComponent => {
    class StackAccessor extends Component {
        static propTypes = {
            label: PropTypes.func,
            values: PropTypes.func,
            x: PropTypes.func,
            y: PropTypes.func,
            y0: PropTypes.func
        };

        static defaultProps = defaultProps;

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    return StackAccessor;
};
