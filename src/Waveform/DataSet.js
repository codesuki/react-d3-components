import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Bar from '../Bar';

export default class DataSet extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        xScale: PropTypes.func.isRequired,
        yScale: PropTypes.func.isRequired,
        colorScale: PropTypes.func.isRequired,
        values: PropTypes.func.isRequired,
        label: PropTypes.func.isRequired,
        x: PropTypes.func.isRequired,
        y: PropTypes.func.isRequired,
        y0: PropTypes.func.isRequired
    };

    renderBar({ height, index, stack, stackValue }) {
        const {
            colorScale,
            onMouseEnter,
            onMouseLeave,
            label,
            x0,
            y
        } = this.props;

        // maps the range [0,1] to the range [0, yDomain]
        const yValue = height * y(stackValue);
        // center vertically to have upper and lower part of the waveform
        const vy = height / 2 - yValue / 2;
        // position x(e) * width * 2 because we want equal sapce.
        const vx = 2 * x0 * index;

        return (
            <Bar
                key={`${label(stack)}.${index}`}
                width={x0}
                height={yValue}
                x={vx}
                y={vy}
                fill={colorScale(Math.floor(vx))}
                data={stackValue}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        );
    }

    render() {
        const { data, values, yScale } = this.props;
        const height = yScale(yScale.domain()[0]);

        return (
            <g>
                {data.map(stack =>
                    values(stack).map((stackValue, index) =>
                        this.renderBar({
                            height,
                            index,
                            stack,
                            stackValue
                        })
                    )
                )}
            </g>
        );
    }
}
