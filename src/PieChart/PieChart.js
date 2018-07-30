import React, { Component } from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';

import DataSet from './DataSet';
import Chart from '../Chart';
import Fragment from '../Fragment';

export class PieChart extends Component {
    static propTypes = {
        innerRadius: PropTypes.number,
        outerRadius: PropTypes.number,
        labelRadius: PropTypes.number,
        padRadius: PropTypes.string,
        cornerRadius: PropTypes.number,
        sort: PropTypes.any,
        hideLabels: PropTypes.bool,
        values: PropTypes.func.isRequired,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        renderTooltip: PropTypes.func.isRequired
    };

    static defaultProps = {
        innerRadius: null,
        outerRadius: null,
        labelRadius: null,
        padRadius: 'auto',
        cornerRadius: 0,
        sort: undefined,
        hideLabels: false
    };

    getTooltipHtml = d => {
        const html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

        return [html, 0, 0];
    };

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
            hideLabels,
            innerWidth,
            innerHeight,
            svgRoot,
            onMouseEnter,
            onMouseLeave,
            children,
            renderTooltip
        } = this.props;

        let { innerRadius, outerRadius, labelRadius } = this.props;

        let pie = d3.layout.pie().value(e => y(e));

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

        const arc = d3.svg
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .padRadius(padRadius)
            .cornerRadius(cornerRadius);

        const outerArc = d3.svg
            .arc()
            .innerRadius(labelRadius)
            .outerRadius(labelRadius);
debugger;
        const pieData = pie(values(data));

        const translation = `translate(${innerWidth / 2}, ${innerHeight / 2})`;

        return (
            <Fragment>
                <Chart
                    height={height}
                    width={width}
                    margin={margin}
                    viewBox={viewBox}
                    preserveAspectRatio={preserveAspectRatio}
                    svgRoot={svgRoot}
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
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            hideLabels={hideLabels}
                        />
                    </g>
                    {children}
                </Chart>
                {renderTooltip(this.getTooltipHtml)}
            </Fragment>
        );
    }
}
