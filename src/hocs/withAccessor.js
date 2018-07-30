import React, { Component } from 'react';
import { func } from 'prop-types';

export const defaultProps = {
    label: stack => stack.label,
    values: stack => stack.values,
    x: e => e.x,
    y: e => e.y,
    y0: () => 0
};

export const withAccessor = WrappedComponent => {
    class Accessor extends Component {
        static propTypes = {
            label: func,
            values: func,
            x: func,
            y: func,
            y0: func
        };

        static defaultProps = defaultProps;

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    return Accessor;
};
