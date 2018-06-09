import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Chart from './Chart';
import Bar from './Bar';

import DefaultPropsMixin from './DefaultPropsMixin';
import HeightWidthMixin from './HeightWidthMixin';
import ArrayifyMixin from './ArrayifyMixin';
import StackAccessorMixin from './StackAccessorMixin';
import StackDataMixin from './StackDataMixin';
import DefaultScalesMixin from './DefaultScalesMixin';
import TooltipMixin from './TooltipMixin';

const { array, func } = PropTypes;

// receive array and return a subsampled array of size n
//
// a= the array;
// n= number of sample you want output
const subSample = function (a, n) {
    const returnArray = [];
    const m = a.length;
    const samplingRatio = m / n;

    //just round down for now in case of comma separated
    for (let i = 0; i < m; ) {
        returnArray.push(a[Math.floor(i)]);
        i += samplingRatio;
    }
    return returnArray;
};

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
            yScale,
            colorScale,
            values,
            label,
            y,
            x0,
            onMouseEnter,
            onMouseLeave
        } = this.props;

        const height = yScale(yScale.domain()[0]);
        const bars = data.map(stack =>
            values(stack).map((e, index) => {
                // maps the range [0,1] to the range [0, yDomain]
                const yValue = height * y(e);
                // center vertically to have upper and lower part of the waveform
                const vy = height / 2 - yValue / 2;
                //position x(e) * width * 2 because we want equal sapce.
                const vx = 2 * x0 * index;

                return (
                    <Bar
                        key={`${label(stack)}.${index}`}
                        width={x0}
                        height={yValue}
                        x={vx}
                        y={vy}
                        fill={colorScale(Math.floor(vx))}
                        data={e}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                );
            })
        );

        return <g>{bars}</g>;
    }
});

const Waveform = createReactClass({
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
        return {};
    },

    _tooltipHtml(d) {
        const [xScale, yScale] = [this._xScale, this._yScale];

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
            height,
            width,
            margin,
            colorScale,
            values,
            label,
            y,
            y0,
            x
        } = this.props;

        const data = this._data;
        const innerWidth = this._innerWidth;
        const xScale = this._xScale;
        const yScale = this._yScale;

        const preserveAspectRatio = 'none';
        const viewBox = `0 0 ${width} ${height}`;

        // there are two options, if the samples are less than the space available
        // we'll stretch the width of bar and inbetween spaces.
        // Otherwise we just subSample the dataArray.
        let barWidth;
        if (data[0].values.length > innerWidth / 2) {
            data[0].values = subSample(data[0].values, innerWidth / 2);
            barWidth = 1;
        } else {
            barWidth = innerWidth / 2 / data[0].values.length;
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
                    <DataSet
                        data={data}
                        xScale={xScale}
                        yScale={yScale}
                        colorScale={colorScale}
                        label={label}
                        values={values}
                        x={x}
                        y={y}
                        y0={y0}
                        x0={barWidth}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                    >
                        {this.props.children}
                    </DataSet>
                </Chart>
            </div>
        );
    }
});

export default Waveform;
