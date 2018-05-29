import React, { Component } from 'react';
import { number, shape } from 'prop-types';

class Chart extends Component {
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

    static propTypes = {
        height: number.isRequired,
        width: number.isRequired,
        margin: shape({
            top: number,
            bottom: number,
            left: number,
            right: number
        }).isRequired
    };
}

export default Chart;
