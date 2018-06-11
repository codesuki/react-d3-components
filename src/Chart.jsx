import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

const { number, shape } = PropTypes;

const Chart = createReactClass({
    propTypes: {
        height: number.isRequired,
        width: number.isRequired,
        margin: shape({
            top: number,
            bottom: number,
            left: number,
            right: number
        }).isRequired
    },

    render() {
        const {
            width,
            height,
            margin,
            viewBox,
            preserveAspectRatio,
            children
        } = this.props;

        return (
            <svg
                ref="svg"
                width={width}
                height={height}
                viewBox={viewBox}
                preserveAspectRatio={preserveAspectRatio}
            >
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {children}
                </g>
            </svg>
        );
    }
});

export default Chart;
