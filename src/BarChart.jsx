import React from 'react';
import d3 from 'd3';

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

let DataSet = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        xScale: React.PropTypes.func.isRequired,
        yScale: React.PropTypes.func.isRequired,
        colorScale: React.PropTypes.func.isRequired,
        values: React.PropTypes.func.isRequired,
        label: React.PropTypes.func.isRequired,
        x: React.PropTypes.func.isRequired,
        y: React.PropTypes.func.isRequired,
        y0: React.PropTypes.func.isRequired
    },

    render() {
        let {data,
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
             transition} = this.props;

        let bars;
        if (groupedBars) {
            bars = data.map((stack, serieIndex) => {
                return values(stack).map((e, index) => {
                    return (
                        <Bar
                            key={`${label(stack)}.${index}`}
                            width={xScale.rangeBand() / data.length}
                            height={yScale(yScale.domain()[0]) - yScale(y(e))}
                            x={xScale(x(e)) + ((xScale.rangeBand() * serieIndex) / data.length)}
                            y={yScale(y(e))}
                            fill={colorScale(label(stack))}
                            data={e}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            />
                    );
                });
            });
        } else {
            bars = data.map(stack => {
                return values(stack).map((e, index) => {
                    return (
                        <Bar
                            key={`${label(stack)}.${index}`}
                            width={xScale.rangeBand()}
                            height={yScale(yScale.domain()[0]) - yScale(y(e))}
                            x={xScale(x(e))}
                            y={yScale(y0(e) + y(e))}
                            fill={colorScale(label(stack))}
                            data={e}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                    transition={transition}
                    xScale={xScale}
                    yScale={yScale}
                            />
                    );
                });
            });
        }

        return (
                <g>{bars}</g>
        );
    }
});

let BarChart = React.createClass({
    mixins: [DefaultPropsMixin,
             HeightWidthMixin,
             ArrayifyMixin,
             StackAccessorMixin,
             StackDataMixin,
             DefaultScalesMixin,
             TooltipMixin],

    getDefaultProps() {
        return {};
    },

    _tooltipHtml(d, position) {
        let [xScale, yScale] = [this._xScale, this._yScale];

        let html = this.props.tooltipHtml(this.props.x(d),
                                          this.props.y0(d),
                                          this.props.y(d));

        let midPoint = xScale.rangeBand() / 2;
        let xPos = midPoint + xScale(this.props.x(d));

        let topStack = this._data[this._data.length - 1].values;
        let topElement = null;

        // TODO: this might not scale if dataset is huge.
        // consider pre-computing yPos for each X
        for (let i = 0; i < topStack.length; i++) {
            if (this.props.x(topStack[i]) === this.props.x(d)) {
                topElement = topStack[i];
                break;
            }
        }
        let yPos = yScale(this.props.y0(topElement) + this.props.y(topElement));

        return [html, xPos, yPos];
    },

    render() {
        let {height,
             width,
             margin,
             colorScale,
             values,
             label,
             y,
             y0,
             x,
             xAxis,
             yAxis,
             groupedBars,
             transition} = this.props;

        let [data,
             innerWidth,
             innerHeight,
             xScale,
             yScale] = [this._data,
                        this._innerWidth,
                        this._innerHeight,
                        this._xScale,
                        this._yScale];

        return (
                <div>
                <Chart height={height} width={width} margin={margin}>
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
            transition={transition}
                />

                <Axis
            className={"x axis"}
            orientation={"bottom"}
            scale={xScale}
            height={innerHeight}
            width={innerWidth}
            {...xAxis}
                />

                <Axis
            className={"y axis"}
            orientation={"left"}
            scale={yScale}
            height={innerHeight}
            width={innerWidth}
            {...yAxis}
                />
                { this.props.children }
                </Chart>

                <Tooltip {...this.state.tooltip}/>
                </div>
        );
    }
});

module.exports = BarChart;
