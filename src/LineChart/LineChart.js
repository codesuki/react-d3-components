import React, { Component } from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';

import DataSet from './DataSet';
import Axis from '../Axis';
import Chart from '../Chart';
import Fragment from '../Fragment';

export class LineChart extends Component {
    static propTypes = {
        interpolate: PropTypes.string,
        defined: PropTypes.func,
        tooltipHidden: PropTypes.bool.isRequired
    };

    static defaultProps = {
        interpolate: 'linear',
        defined: () => true,
        shape: 'circle',
        shapeColor: null,
        showCustomLine: false,
        lineStructureClassName: 'dot',
        customPointColor: 'blue',
        customPointShape: 'circle'
    };

    /*
     The code below supports finding the data values for the line closest to the mouse cursor.
     Since it gets all events from the Rect overlaying the Chart the tooltip gets shown everywhere.
     For now I don't want to use this method.
     */
    getTooltipHtml = (data, position) => {
        const { x, y, values, label, xScale, yScale } = this.props;

        const xValueCursor = xScale.invert(position[0]);
        const yValueCursor = yScale.invert(position[1]);

        const xBisector = d3.bisector(e => x(e)).left;
        const valuesAtX = data.map(stack => {
            const idx = xBisector(values(stack), xValueCursor);

            const indexRight = idx === values(stack).length ? idx - 1 : idx;
            const valueRight = x(values(stack)[indexRight]);

            const indexLeft = idx === 0 ? idx : idx - 1;
            const valueLeft = x(values(stack)[indexLeft]);

            let index;
            if (
                Math.abs(xValueCursor - valueRight) <
                Math.abs(xValueCursor - valueLeft)
            ) {
                index = indexRight;
            } else {
                index = indexLeft;
            }

            return { label: label(stack), value: values(stack)[index] };
        });

        valuesAtX.sort((a, b) => y(a.value) - y(b.value));

        const yBisector = d3.bisector(e => y(e.value)).left;
        const yIndex = yBisector(valuesAtX, yValueCursor);

        const yIndexRight = yIndex === valuesAtX.length ? yIndex - 1 : yIndex;
        const yIndexLeft = yIndex === 0 ? yIndex : yIndex - 1;

        const yValueRight = y(valuesAtX[yIndexRight].value);
        const yValueLeft = y(valuesAtX[yIndexLeft].value);

        let index;
        if (
            Math.abs(yValueCursor - yValueRight) <
            Math.abs(yValueCursor - yValueLeft)
        ) {
            index = yIndexRight;
        } else {
            index = yIndexLeft;
        }

        this._tooltipData = valuesAtX[index];

        const html = this.props.tooltipHtml(
            valuesAtX[index].label,
            valuesAtX[index].value
        );

        const xPos = xScale(valuesAtX[index].value.x);
        const yPos = yScale(valuesAtX[index].value.y);

        return [html, xPos, yPos];
    };

    onMouseEnter = evt => this.props.onMouseEnter(evt, this.props.data);

    render() {
        const {
            height,
            width,
            margin,
            viewBox,
            preserveAspectRatio,
            colorScale,
            interpolate,
            defined,
            stroke,
            values,
            label,
            x,
            y,
            xAxis,
            yAxis,
            shape,
            shapeColor,
            showCustomLine,
            lineStructureClassName,
            customPointColor,
            customPointShape,
            data,
            innerWidth,
            innerHeight,
            xScale,
            yScale,
            xIntercept,
            yIntercept,
            svgRoot,
            onMouseLeave
        } = this.props;

        const line = d3.svg
            .line()
            .x(e => xScale(x(e)))
            .y(e => yScale(y(e)))
            .interpolate(interpolate)
            .defined(defined);

        let tooltipSymbol = null;
        let points = null;

        const TooltipComponent = this.props.renderTooltip(this.getTooltipHtml);

        if (!this.props.tooltipHidden) {
            const symbol = d3.svg.symbol().type(shape);
            const symbolColor = shapeColor
                ? shapeColor
                : colorScale(this._tooltipData.label);
            const translate = this._tooltipData
                ? `translate(${xScale(x(this._tooltipData.value))}, ${yScale(
                      y(this._tooltipData.value)
                  )})`
                : '';

            tooltipSymbol = this.props.tooltipHidden ? null : (
                <path
                    className="dot"
                    d={symbol()}
                    transform={translate}
                    fill={symbolColor}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={onMouseLeave}
                />
            );
        }

        if (showCustomLine) {
            const translatePoints = function(point) {
                return `translate(${xScale(x(point))}, ${yScale(y(point))})`;
            };

            points = data.map(d =>
                d.values.map((p, i) => (
                    <path
                        key={i}
                        className={lineStructureClassName}
                        d={d3.svg.symbol().type(customPointShape)()}
                        transform={translatePoints(p)}
                        fill={customPointColor}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                ))
            );
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
                        height={innerHeight}
                        width={innerWidth}
                        data={data}
                        line={line}
                        colorScale={colorScale}
                        values={values}
                        label={label}
                        onMouseEnter={this.props.onMouseEnter}
                        onMouseLeave={this.props.onMouseLeave}
                        {...stroke}
                    />
                    {this.props.children}
                    {tooltipSymbol}
                    {points}
                </Chart>
                {TooltipComponent}
            </Fragment>
        );
    }
}
