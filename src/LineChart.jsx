import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import d3 from 'd3';

import Chart from './Chart';
import Axis from './Axis';
import Path from './Path';
import Tooltip from './Tooltip';

import DefaultPropsMixin from './DefaultPropsMixin';
import HeightWidthMixin from './HeightWidthMixin';
import ArrayifyMixin from './ArrayifyMixin';
import AccessorMixin from './AccessorMixin';
import DefaultScalesMixin from './DefaultScalesMixin';
import TooltipMixin from './TooltipMixin';

const { array, func, string } = PropTypes;

const DataSet = createReactClass({
    propTypes: {
        data: array.isRequired,
        line: func.isRequired,
        colorScale: func.isRequired
    },

    render() {
        const {
            width,
            height,
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

        const sizeId = width + 'x' + height;

        const lines = data.map((stack, index) =>
            <Path
                key={`${label(stack)}.${index}`}
                className={'line'}
                d={line(values(stack))}
                stroke={colorScale(label(stack))}
                strokeWidth={
                    typeof strokeWidth === 'function'
                        ? strokeWidth(label(stack))
                        : strokeWidth
                }
                strokeLinecap={
                    typeof strokeLinecap === 'function'
                        ? strokeLinecap(label(stack))
                        : strokeLinecap
                }
                strokeDasharray={
                    typeof strokeDasharray === 'function'
                        ? strokeDasharray(label(stack))
                        : strokeDasharray
                }
                data={values(stack)}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={{ clipPath: `url(#lineClip_${sizeId})` }}
            />
        );

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
                {lines}
                <rect
                    width={width}
                    height={height}
                    fill={'none'}
                    stroke={'none'}
                    style={{ pointerEvents: 'all' }}
                    onMouseMove={evt => {
                        onMouseEnter(evt, data);
                    }}
                    onMouseLeave={evt => {
                        onMouseLeave(evt);
                    }}
                />
            </g>
        );
    }
});

const LineChart = createReactClass({
    mixins: [
        DefaultPropsMixin,
        HeightWidthMixin,
        ArrayifyMixin,
        AccessorMixin,
        DefaultScalesMixin,
        TooltipMixin
    ],

    propTypes: {
        interpolate: string,
        defined: func
    },

    getDefaultProps() {
        return {
            interpolate: 'linear',
            defined: () => true,
            shape: 'circle',
            shapeColor: null,
            showCustomLine: false,
            lineStructureClassName: 'dot',
            customPointColor: 'blue',
            customPointShape: 'circle'
        };
    },

    /*
     The code below supports finding the data values for the line closest to the mouse cursor.
     Since it gets all events from the Rect overlaying the Chart the tooltip gets shown everywhere.
     For now I don't want to use this method.
     */
    _tooltipHtml(data, position) {
        const { x, y, values, label } = this.props;
        const xScale = this._xScale;
        const yScale = this._yScale;

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
    },

    /*
    _tooltipHtml(data, position) {
        let {x, y0, y, values, label} = this.props;
        let [xScale, yScale] = [this._xScale, this._yScale];

        let xValueCursor = xScale.invert(position[0]);
        let yValueCursor = yScale.invert(position[1]);

        let xBisector = d3.bisector(e => { return x(e); }).left;
        let xIndex = xBisector(data, xScale.invert(position[0]));

        let indexRight = xIndex == data.length ? xIndex - 1 : xIndex;
        let valueRight = x(data[indexRight]);

        let indexLeft = xIndex == 0 ? xIndex : xIndex - 1;
        let valueLeft = x(data[indexLeft]);

        let index;
        if (Math.abs(xValueCursor - valueRight) < Math.abs(xValueCursor - valueLeft)) {
            index = indexRight;
        } else {
            index = indexLeft;
        }

        let yValue = y(data[index]);
        let cursorValue = d3.round(yScale.invert(position[1]), 2);

        return this.props.tooltipHtml(yValue, cursorValue);
    },
     */

    /*
             stroke,
             strokeWidth,
             strokeLinecap,
             strokeDasharray,
     */
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
            customPointShape
        } = this.props;

        const data = this._data;
        const innerWidth = this._innerWidth;
        const innerHeight = this._innerHeight;
        const xScale = this._xScale;
        const yScale = this._yScale;
        const xIntercept = this._xIntercept;
        const yIntercept = this._yIntercept;

        const line = d3.svg
            .line()
            .x(e => xScale(x(e)))
            .y(e => yScale(y(e)))
            .interpolate(interpolate)
            .defined(defined);

        let tooltipSymbol = null,
            points = null;
        if (!this.state.tooltip.hidden) {
            const symbol = d3.svg.symbol().type(shape);
            const symbolColor = shapeColor
                ? shapeColor
                : colorScale(this._tooltipData.label);

            const translate = this._tooltipData
                ? `translate(${xScale(x(this._tooltipData.value))}, ${yScale(
                      y(this._tooltipData.value)
                  )})`
                : '';
            tooltipSymbol = this.state.tooltip.hidden ? null :
                <path
                    className="dot"
                    d={symbol()}
                    transform={translate}
                    fill={symbolColor}
                    onMouseEnter={evt => this.onMouseEnter(evt, data)}
                    onMouseLeave={evt => this.onMouseLeave(evt)}
                />
            ;
        }

        if (showCustomLine) {
            const translatePoints = function (point) {
                return `translate(${xScale(x(point))}, ${yScale(y(point))})`;
            };

            points = data.map(d =>
                d.values.map((p, i) =>
                    <path
                        key={i}
                        className={lineStructureClassName}
                        d={d3.svg.symbol().type(customPointShape)()}
                        transform={translatePoints(p)}
                        fill={customPointColor}
                        onMouseEnter={evt => this.onMouseEnter(evt, data)}
                        onMouseLeave={evt => this.onMouseLeave(evt)}
                    />
                )
            );
        }

        return (
            <div>
                <Chart
                    height={height}
                    width={width}
                    margin={margin}
                    viewBox={viewBox}
                    preserveAspectRatio={preserveAspectRatio}
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
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        {...stroke}
                    />
                    {this.props.children}
                    {tooltipSymbol}
                    {points}
                </Chart>
                <Tooltip {...this.state.tooltip} />
            </div>
        );
    }
});

export default LineChart;
