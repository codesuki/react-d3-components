import React from 'react';
import { number, shape } from 'prop-types';

const Chart = ({
    width,
    height,
    margin,
    viewBox,
    preserveAspectRatio,
    children
}) =>
    <svg
        ref="svg"
        width={width}
        height={height}
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
    >
        <g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
    </svg>
;

Chart.propTypes = {
    height: number.isRequired,
    width: number.isRequired,
    margin: shape({
        top: number,
        bottom: number,
        left: number,
        right: number
    }).isRequired
};

export default Chart;
