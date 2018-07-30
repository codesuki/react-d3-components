import React, { Component } from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';

import DataSet from './DataSet';
import Axis from '../Axis';
import Chart from '../Chart';
import Fragment from '../Fragment';

export class ScatterPlot extends Component {
    static propTypes = {
        rScale: PropTypes.func,
        shape: PropTypes.string
    };

    static defaultProps = {
        rScale: null,
        shape: 'circle'
    };

    getTooltipHtml = d => {
        const html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));
        const xPos = this.props.xScale(this.props.x(d));
        const yPos = this.props.yScale(this.props.y(d));

        return [html, xPos, yPos];
    };

    render() {
        const {
            height,
            width,
            margin,
            viewBox,
            preserveAspectRatio,
            colorScale,
            rScale,
            shape,
            label,
            values,
            x,
            y,
            xAxis,
            yAxis,
            data,
            innerWidth,
            innerHeight,
            xScale,
            yScale,
            xIntercept,
            yIntercept,
            svgRoot,
            onMouseEnter,
            onMouseLeave,
            children,
            renderTooltip
        } = this.props;

        let symbol = d3.svg.symbol().type(shape);

        if (rScale) {
            symbol = symbol.size(rScale);
        }

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
                    <Axis
                        className="x axis"
                        orientation="bottom"
                        scale={xScale}
                        height={innerHeight}
                        width={innerWidth}
                        zero={yIntercept}
                        {...xAxis}
                    />
                    <Axis
                        className="y axis"
                        orientation="left"
                        scale={yScale}
                        height={innerHeight}
                        width={innerWidth}
                        zero={xIntercept}
                        {...yAxis}
                    />
                    <DataSet
                        data={data}
                        xScale={xScale}
                        yScale={yScale}
                        colorScale={colorScale}
                        symbol={symbol}
                        label={label}
                        values={values}
                        x={x}
                        y={y}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                    {children}
                </Chart>
                {renderTooltip(this.getTooltipHtml)}
            </Fragment>
        );
    }
}
