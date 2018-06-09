import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DataSet from './DataSet';
import Chart from '../Chart';
import { margitType } from '../hocs/withDefaultProps';

// receive array and return a subsampled array of size n
//
// a= the array;
// n= number of sample you want output
const subSample = (a, n) => {
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

export class Waveform extends Component {
    static propTypes = {
        colorScale: PropTypes.func.isRequired,
        data: PropTypes.array.isRequired,
        height: PropTypes.number.isRequired,
        innerWidth: PropTypes.number.isRequired,
        label: PropTypes.func.isRequired,
        margin: margitType.isRequired,
        values: PropTypes.func.isRequired,
        width: PropTypes.number.isRequired,
        x: PropTypes.func.isRequired,
        xScale: PropTypes.func.isRequired,
        y0: PropTypes.func.isRequired,
        y: PropTypes.func.isRequired,
        yScale: PropTypes.func.isRequired
    };

    /*_tooltipHtml(d) {
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
    }*/

    render() {
        const {
            children,
            colorScale,
            data,
            height,
            innerWidth,
            label,
            margin,
            onMouseEnter,
            onMouseLeave,
            values,
            width,
            x,
            xScale,
            y,
            y0,
            yScale
        } = this.props;

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
            <Chart
                height={height}
                width={width}
                margin={margin}
                viewBox={viewBox}
                preserveAspectRatio="none"
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
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    {children}
                </DataSet>
            </Chart>
        );
    }
}
