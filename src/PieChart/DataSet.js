import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Wedge from './Wedge';

export default class DataSet extends Component {
    static propTypes = {
        pie: PropTypes.array.isRequired,
        arc: PropTypes.func.isRequired,
        outerArc: PropTypes.func.isRequired,
        colorScale: PropTypes.func.isRequired,
        radius: PropTypes.number.isRequired,
        strokeWidth: PropTypes.number,
        stroke: PropTypes.string,
        fill: PropTypes.string,
        opacity: PropTypes.number,
        x: PropTypes.func.isRequired,
        y: PropTypes.func.isRequired,
        hideLabels: PropTypes.bool
    };

    static defaultProps = {
        strokeWidth: 2,
        stroke: '#000',
        fill: 'none',
        opacity: 0.3,
        hideLabels: false
    };

    renderLabel(wedge) {
        const {
            arc,
            outerArc,
            radius,
            strokeWidth,
            stroke,
            fill,
            opacity,
            x
        } = this.props;

        const labelPos = outerArc.centroid(wedge);
        labelPos[0] = radius * (DataSet.midAngle(wedge) < Math.PI ? 1 : -1);

        const linePos = outerArc.centroid(wedge);
        linePos[0] =
            radius * 0.95 * (DataSet.midAngle(wedge) < Math.PI ? 1 : -1);

        const textAnchor = DataSet.midAngle(wedge) < Math.PI ? 'start' : 'end';

        return (
            <g>
                <polyline
                    opacity={opacity}
                    strokeWidth={strokeWidth}
                    stroke={stroke}
                    fill={fill}
                    points={[
                        arc.centroid(wedge),
                        outerArc.centroid(wedge),
                        linePos
                    ]}
                />
                <text
                    dy=".35em"
                    x={labelPos[0]}
                    y={labelPos[1]}
                    textAnchor={textAnchor}
                >
                    {x(wedge.data)}
                </text>
            </g>
        );
    }

    render() {
        const {
            pie,
            arc,
            colorScale,
            x,
            y,
            onMouseEnter,
            onMouseLeave,
            hideLabels
        } = this.props;

        const wedges = pie.map((e, index) => {
            const labelFits = e.endAngle - e.startAngle >= 10 * Math.PI / 180;

            return (
                <g key={`${x(e.data)}.${y(e.data)}.${index}`} className="arc">
                    <Wedge
                        data={e.data}
                        fill={colorScale(x(e.data))}
                        d={arc(e)}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                    {!hideLabels &&
                        !!e.value &&
                        labelFits &&
                        this.renderLabel(e)}
                </g>
            );
        });

        return <g>{wedges}</g>;
    }

    static midAngle({ startAngle, endAngle }) {
        return startAngle + (endAngle - startAngle) / 2;
    }
}
