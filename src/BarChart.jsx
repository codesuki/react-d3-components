import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import Chart from './Chart';
import Axis from './Axis';
import Bar from './Bar';
import Tooltip from './Tooltip';

import DefaultPropsMixin from './DefaultPropsMixin';
import HeightWidthMixin from './HeightWidthMixin';
import ArrayifyMixin from './ArrayifyMixin';
import StackAccessorMixin from './StackAccessorMixin';
import StackDataMixin from './StackDataMixin';
import DefaultScalesMixin from './DefaultScalesMixin';
import TooltipMixin from './TooltipMixin';

const { array, func } = PropTypes;

const DataSet = createReactClass({
    propTypes: {
        data: array.isRequired,
        xScale: func.isRequired,
        yScale: func.isRequired,
        colorScale: func.isRequired,
        values: func.isRequired,
        label: func.isRequired,
        x: func.isRequired,
        y: func.isRequired,
        y0: func.isRequired
    },

    render() {
        const {
            data,
            xScale,
            yScale,
            colorScale,
            values,
            label,
            x,
            y,
            y0,
            onMouseEnter,
            onMouseLeave,
            groupedBars,
            colorByLabel
        } = this.props;

        let bars;
        if (groupedBars) {
            bars = data.map((stack, serieIndex) =>
                values(stack).map((e, index) => {
                    const yVal = y(e) < 0 ? yScale(0) : yScale(y(e));
                    return (
                        <Bar
                            key={`${label(stack)}.${index}`}
                            width={xScale.rangeBand() / data.length}
                            height={Math.abs(yScale(0) - yScale(y(e)))}
                            x={
                                xScale(x(e)) +
                                xScale.rangeBand() * serieIndex / data.length
                            }
                            y={yVal}
                            fill={colorScale(label(stack))}
                            data={e}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        />
                    );
                })
            );
        } else {
            bars = data.map(stack =>
                values(stack).map((e, index) => {
                    const color = colorByLabel
                        ? colorScale(label(stack))
                        : colorScale(x(e));
                    const yVal =
                        y(e) < 0 ? yScale(y0(e)) : yScale(y0(e) + y(e));
                    return (
                        <Bar
                            key={`${label(stack)}.${index}`}
                            width={xScale.rangeBand()}
                            height={Math.abs(
                                yScale(y0(e) + y(e)) - yScale(y0(e))
                            )}
                            x={xScale(x(e))}
                            y={yVal}
                            fill={color}
                            data={e}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        />
                    );
                })
            );
        }

        return <g>{bars}</g>;
    }
});

const BarChart = createReactClass({
    mixins: [
        DefaultPropsMixin,
        HeightWidthMixin,
        ArrayifyMixin,
        StackAccessorMixin,
        StackDataMixin,
        DefaultScalesMixin,
        TooltipMixin
    ],

    getDefaultProps() {
        return {
            colorByLabel: true
        };
    },

    _tooltipHtml(d) {
        const xScale = this._xScale;
        const yScale = this._yScale;

        const html = this.props.tooltipHtml(
            this.props.x(d),
            this.props.y0(d),
            this.props.y(d)
        );

        const midPoint = xScale.rangeBand() / 2;
        const xPos = midPoint + xScale(this.props.x(d));

        const topStack = this._data[this._data.length - 1].values;
        let topElement = null;

        // TODO: this might not scale if dataset is huge.
        // consider pre-computing yPos for each X
        for (let i = 0; i < topStack.length; i++) {
            if (this.props.x(topStack[i]) === this.props.x(d)) {
                topElement = topStack[i];
                break;
            }
        }
        const yPos = yScale(
            this.props.y0(topElement) + this.props.y(topElement)
        );

        return [html, xPos, yPos];
    },

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
            tickFormat
        } = this.props;

        const data = this._data;
        const innerWidth = this._innerWidth;
        const innerHeight = this._innerHeight;
        const xScale = this._xScale;
        const yScale = this._yScale;
        const yIntercept = this._yIntercept;

        return (
            <div>
                <Chart
                    height={height}
                    width={width}
                    margin={margin}
                    viewBox={viewBox}
                    preserveAspectRatio={preserveAspectRatio}
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
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
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
                    {this.props.children}
                </Chart>
                <Tooltip {...this.state.tooltip} />
            </div>
        );
    }
});

export default BarChart;
