import React, { Component } from 'react';

import DataSet from './DataSet';
import Axis from '../Axis';
import Chart from '../Chart';
import Fragment from '../Fragment';

export class BarChart extends Component {
    static defaultProps = {
        colorByLabel: true
    };

    getTooltipHtml = d => {
        const { yScale, xScale, data, x, y, y0 } = this.props;
        const html = this.props.tooltipHtml(x(d), y0(d), y(d));
        const midPoint = xScale.rangeBand() / 2;
        const xPos = midPoint + xScale(x(d));
        const topStack = data[data.length - 1].values;

        let topElement = null;

        // TODO: this might not scale if dataset is huge.
        // consider pre-computing yPos for each X
        for (let i = 0; i < topStack.length; i++) {
            if (x(topStack[i]) === x(d)) {
                topElement = topStack[i];
                break;
            }
        }

        const yPos = yScale(y0(topElement) + y(topElement));

        return [html, xPos, yPos];
    };

    render() {
        const {
            xAxis,
            yAxis,
            height,
            width,
            margin,
            viewBox,
            preserveAspectRatio,
            colorScale,
            values,
            label,
            y,
            y0,
            x,
            groupedBars,
            colorByLabel,
            tickFormat,
            data,
            innerWidth,
            innerHeight,
            xScale,
            yScale,
            yIntercept,
            onMouseEnter,
            onMouseLeave,
            children,
            renderTooltip,
            svgRoot
        } = this.props;

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
                    <DataSet
                        data={data}
                        xScale={xScale}
                        yScale={yScale}
                        colorScale={colorScale}
                        values={values}
                        label={label}
                        y={y}
                        y0={y0}
                        x={x}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        groupedBars={groupedBars}
                        colorByLabel={colorByLabel}
                    />
                    <Axis
                        className="x axis"
                        orientation="bottom"
                        scale={xScale}
                        height={innerHeight}
                        width={innerWidth}
                        zero={yIntercept}
                        tickFormat={tickFormat}
                        {...xAxis}
                    />
                    <Axis
                        className="y axis"
                        orientation="left"
                        scale={yScale}
                        height={innerHeight}
                        width={innerWidth}
                        tickFormat={tickFormat}
                        {...yAxis}
                    />
                    {children}
                </Chart>
                {renderTooltip(this.getTooltipHtml)}
            </Fragment>
        );
    }
}
