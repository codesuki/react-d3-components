import React, { PropTypes } from 'react';

const { number, shape } = PropTypes;

const Chart = React.createClass({
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
            <svg ref="svg" width={width} height={height} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} >
                <g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
            </svg>
        );
    }
});

export default Chart;
