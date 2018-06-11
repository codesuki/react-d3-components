import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import d3 from 'd3';

import Chart from './Chart';
import Axis from './Axis';
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
        symbol: func.isRequired,
        xScale: func.isRequired,
        yScale: func.isRequired,
        colorScale: func.isRequired,
        onMouseEnter: func,
        onMouseLeave: func
    },

    render() {
        const {
            data,
            symbol,
            xScale,
            yScale,
            colorScale,
            label,
            values,
            x,
            y,
            onMouseEnter,
            onMouseLeave
        } = this.props;

        const circles = data.map(stack =>
            values(stack).map((e, index) => {
                const translate = `translate(${xScale(x(e))}, ${yScale(y(e))})`;
                return (
                    <path
                        key={`${label(stack)}.${index}`}
                        className="dot"
                        d={symbol()}
                        transform={translate}
                        fill={colorScale(label(stack))}
                        onMouseOver={evt => onMouseEnter(evt, e)}
                        onMouseLeave={evt => onMouseLeave(evt)}
                    />
                );
            })
        );

        return <g>{circles}</g>;
    }
});

const ScatterPlot = createReactClass({
    mixins: [
        DefaultPropsMixin,
        HeightWidthMixin,
        ArrayifyMixin,
        AccessorMixin,
        DefaultScalesMixin,
        TooltipMixin
    ],

    propTypes: {
        rScale: func,
        shape: string
    },

    getDefaultProps() {
        return {
            rScale: null,
            shape: 'circle'
        };
    },

    _tooltipHtml(d) {
        const html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

        const xPos = this._xScale(this.props.x(d));
        const yPos = this._yScale(this.props.y(d));

        return [html, xPos, yPos];
    },

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
            yAxis
        } = this.props;

        const data = this._data;
        const innerWidth = this._innerWidth;
        const innerHeight = this._innerHeight;
        const xScale = this._xScale;
        const yScale = this._yScale;
        const xIntercept = this._xIntercept;
        const yIntercept = this._yIntercept;

        let symbol = d3.svg.symbol().type(shape);

        if (rScale) {
            symbol = symbol.size(rScale);
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
                        data={data}
                        xScale={xScale}
                        yScale={yScale}
                        colorScale={colorScale}
                        symbol={symbol}
                        label={label}
                        values={values}
                        x={x}
                        y={y}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                    />
                    {this.props.children}
                </Chart>
                <Tooltip {...this.state.tooltip} />
            </div>
        );
    }
});

export default ScatterPlot;
