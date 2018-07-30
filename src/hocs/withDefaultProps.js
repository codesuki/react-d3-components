import React, { Component } from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';

export const defaultProps = {
    data: {
        label: 'No data available',
        values: [{ x: 'No data available', y: 1 }]
    },
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    xScale: null,
    yScale: null,
    colorScale: d3.scale.category20()
};

export const margitType = PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number
});

export const withDefaultProps = WrappedComponent => {
    class DefaultProps extends Component {
        static propTypes = {
            data: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
                .isRequired,
            height: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
            margin: margitType,
            xScale: PropTypes.func,
            yScale: PropTypes.func,
            colorScale: PropTypes.func
        };

        static defaultProps = defaultProps;

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    return DefaultProps;
};
