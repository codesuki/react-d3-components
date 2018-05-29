import React, { Component } from 'react';
import createReactClass from 'create-react-class';
import { pie as d3Pie, arc as d3Arc } from 'd3-shape';
import { string, array, number, bool, func, any } from 'prop-types';

import Chart from './Chart';
import Tooltip from './Tooltip';

import AccessorMixin from './AccessorMixin';
import DefaultPropsMixin from './DefaultPropsMixin';
import HeightWidthMixin from './HeightWidthMixin';
import TooltipMixin from './TooltipMixin';

const Wedge = ({ fill, d, data, onMouseEnter, onMouseLeave }) =>
    <path
        fill={fill}
        d={d}
        onMouseMove={evt => onMouseEnter(evt, data)}
        onMouseLeave={evt => onMouseLeave(evt)}
    />
;

Wedge.propTypes = {
    d: string.isRequired,
    fill: string.isRequired
};

class DataSet extends Component {
    static propTypes = {
        pie: array.isRequired,
        arc: func.isRequired,
        outerArc: func.isRequired,
        colorScale: func.isRequired,
        radius: number.isRequired,
        strokeWidth: number,
        stroke: string,
        fill: string,
        opacity: number,
        x: func.isRequired,
        hideLabels: bool
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

    static midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
}

const PieChart = createReactClass({
    mixins: [DefaultPropsMixin, HeightWidthMixin, AccessorMixin, TooltipMixin],

    propTypes: {
        innerRadius: number,
        outerRadius: number,
        labelRadius: number,
        padRadius: string,
        cornerRadius: number,
        sort: any,
        hideLabels: bool
    },

    getDefaultProps() {
        return {
            innerRadius: null,
            outerRadius: null,
            labelRadius: null,
            padRadius: 'auto',
            cornerRadius: 0,
            sort: undefined,
            hideLabels: false
        };
    },

    _tooltipHtml(d) {
        const html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

        return [html, 0, 0];
    },

    render() {
        const {
            data,
            width,
            height,
            margin,
            viewBox,
            preserveAspectRatio,
            colorScale,
            padRadius,
            cornerRadius,
            sort,
            x,
            y,
            values,
            hideLabels
        } = this.props;

        let { innerRadius, outerRadius, labelRadius } = this.props;

        const innerWidth = this._innerWidth;
        const innerHeight = this._innerHeight;

        let pie = d3Pie().value(e => y(e));

        if (typeof sort !== 'undefined') {
            pie = pie.sort(sort);
        }

        const radius = Math.min(innerWidth, innerHeight) / 2;
        if (!innerRadius) {
            innerRadius = radius * 0.8;
        }

        if (!outerRadius) {
            outerRadius = radius * 0.4;
        }

        if (!labelRadius) {
            labelRadius = radius * 0.9;
        }

        const arc = d3Arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .padRadius(padRadius)
            .cornerRadius(cornerRadius);

        const outerArc = d3Arc()
            .innerRadius(labelRadius)
            .outerRadius(labelRadius);

        const pieData = pie(values(data));

        const translation = `translate(${innerWidth / 2}, ${innerHeight / 2})`;

        return (
            <div>
                <Chart
                    height={height}
                    width={width}
                    margin={margin}
                    viewBox={viewBox}
                    preserveAspectRatio={preserveAspectRatio}
                >
                    <g transform={translation}>
                        <DataSet
                            width={innerWidth}
                            height={innerHeight}
                            colorScale={colorScale}
                            pie={pieData}
                            arc={arc}
                            outerArc={outerArc}
                            radius={radius}
                            x={x}
                            y={y}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                            hideLabels={hideLabels}
                        />
                    </g>
                    {this.props.children}
                </Chart>
                <Tooltip {...this.state.tooltip} />
            </div>
        );
    }
});

export default PieChart;
