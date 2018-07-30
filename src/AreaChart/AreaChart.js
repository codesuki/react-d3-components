import d3 from 'd3';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import DataSet from './DataSet';
import Axis from '../Axis';
import Chart from '../Chart';
import Fragment from '../Fragment';

export class AreaChart extends Component {
    static propTypes = {
        interpolate: PropTypes.string,
        stroke: PropTypes.func
    };

    static defaultProps = {
        interpolate: 'linear',
        stroke: d3.scale.category20()
    };

    getTooltipHtml = /* istanbul ignore next */ (d, position) => {
        const { x, y0, y, values, label, xScale, yScale } = this.props;
        const xValueCursor = xScale.invert(position[0]);

        const xBisector = d3.bisector(e => x(e)).right;
        let xIndex = xBisector(values(d[0]), xScale.invert(position[0]));
        xIndex = xIndex == values(d[0]).length ? xIndex - 1 : xIndex;

        const xIndexRight = xIndex == values(d[0]).length ? xIndex - 1 : xIndex;
        const xValueRight = x(values(d[0])[xIndexRight]);

        const xIndexLeft = xIndex == 0 ? xIndex : xIndex - 1;
        const xValueLeft = x(values(d[0])[xIndexLeft]);

        if (
            Math.abs(xValueCursor - xValueRight) <
            Math.abs(xValueCursor - xValueLeft)
        ) {
            xIndex = xIndexRight;
        } else {
            xIndex = xIndexLeft;
        }

        const yValueCursor = yScale.invert(position[1]);

        const yBisector = d3.bisector(
            e => y0(values(e)[xIndex]) + y(values(e)[xIndex])
        ).left;
        let yIndex = yBisector(d, yValueCursor);
        yIndex = yIndex == d.length ? yIndex - 1 : yIndex;

        const yValue = y(values(d[yIndex])[xIndex]);
        const yValueCumulative =
            y0(values(d[d.length - 1])[xIndex]) +
            y(values(d[d.length - 1])[xIndex]);

        const xValue = x(values(d[yIndex])[xIndex]);

        const xPos = xScale(xValue);
        const yPos = yScale(y0(values(d[yIndex])[xIndex]) + yValue);

        return [
            this.props.tooltipHtml(
                yValue,
                yValueCumulative,
                xValue,
                label(d[yIndex])
            ),
            xPos,
            yPos
        ];
    };

    render() {
        const {
            height,
            width,
            margin,
            viewBox,
            preserveAspectRatio,
            colorScale,
            interpolate,
            stroke,
            values,
            label,
            x,
            y,
            y0,
            xAxis,
            yAxis,
            yOrientation,
            xScale,
            yScale,
            data,
            innerWidth,
            innerHeight,
            svgRoot,
            onMouseEnter,
            onMouseLeave,
            children,
            renderTooltip
        } = this.props;

        /* istanbul ignore next */
        const line = d3.svg
            .line()
            .x(e => xScale(x(e)))
            .y(e => yScale(y0(e) + y(e)))
            .interpolate(interpolate);

        /* istanbul ignore next */
        const area = d3.svg
            .area()
            .x(e => xScale(x(e)))
            .y0(e => yScale(yScale.domain()[0] + y0(e)))
            .y1(e => yScale(y0(e) + y(e)))
            .interpolate(interpolate);

        return (
            <Fragment>
                <Chart
                    height={height}
                    width={width}
                    margin={margin}
                    viewBox={viewBox}
                    svgRoot={svgRoot}
                    preserveAspectRatio={preserveAspectRatio}
                >
                    <DataSet
                        data={data}
                        line={line}
                        area={area}
                        colorScale={colorScale}
                        stroke={stroke}
                        label={label}
                        values={values}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                    <Axis
                        className="x axis"
                        orientation="bottom"
                        scale={xScale}
                        height={innerHeight}
                        width={innerWidth}
                        {...xAxis}
                    />
                    <Axis
                        className="y axis"
                        orientation={yOrientation || 'left'}
                        scale={yScale}
                        height={innerHeight}
                        width={innerWidth}
                        {...yAxis}
                    />
                    {children}
                </Chart>
                {renderTooltip(this.getTooltipHtml)}
            </Fragment>
        );
    }
}
