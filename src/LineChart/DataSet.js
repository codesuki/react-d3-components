import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Path from '../Path';
import { isFunc } from '../utils/is-func';

const rectStyle = { pointerEvents: 'all' };

export default class DataSet extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        line: PropTypes.func.isRequired,
        colorScale: PropTypes.func.isRequired
    };

    onMouseMove = evt => this.props.onMouseEnter(evt, this.props.data);

    render() {
        const { width, height, onMouseLeave } = this.props;
        const sizeId = width + 'x' + height;

        /*
         The <rect> below is needed in case we want to show the tooltip no matter where on the chart the mouse is.
         Not sure if this should be used.
         */
        return (
            <g>
                <defs>
                    <clipPath id={`lineClip_${sizeId}`}>
                        <rect width={width} height={height} />
                    </clipPath>
                </defs>
                {this.renderLines(sizeId)}
                <rect
                    width={width}
                    height={height}
                    fill="none"
                    stroke="none"
                    style={rectStyle}
                    onMouseMove={this.onMouseMove}
                    onMouseLeave={onMouseLeave}
                />
            </g>
        );
    }

    renderLines(sizeId) {
        const {
            data,
            line,
            strokeWidth,
            strokeLinecap,
            strokeDasharray,
            colorScale,
            values,
            label,
            onMouseEnter,
            onMouseLeave
        } = this.props;

        return data.map((stack, index) => (
            <Path
                key={`${label(stack)}.${index}`}
                className="line"
                d={line(values(stack))}
                stroke={colorScale(label(stack))}
                strokeWidth={
                    isFunc(strokeWidth)
                        ? strokeWidth(label(stack))
                        : strokeWidth
                }
                strokeLinecap={
                    isFunc(strokeLinecap)
                        ? strokeLinecap(label(stack))
                        : strokeLinecap
                }
                strokeDasharray={
                    isFunc(strokeDasharray)
                        ? strokeDasharray(label(stack))
                        : strokeDasharray
                }
                data={values(stack)}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={{ clipPath: `url(#lineClip_${sizeId})` }}
            />
        ));
    }
}
