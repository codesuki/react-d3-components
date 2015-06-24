import React from 'react';
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

let DataSet = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        symbol: React.PropTypes.func.isRequired,
        xScale: React.PropTypes.func.isRequired,
        yScale: React.PropTypes.func.isRequired,
        colorScale: React.PropTypes.func.isRequired,
        onMouseEnter: React.PropTypes.func,
        onMouseLeave: React.PropTypes.func
    },

    render() {
        let {data,
             symbol,
             xScale,
             yScale,
             colorScale,
             label,
             values,
             x,
             y,
             onMouseEnter,
             onMouseLeave} = this.props;

        let circles = data.map(stack => {
            return values(stack).map((e, index) => {
                let translate = `translate(${xScale(x(e))}, ${yScale(y(e))})`;
                return (
                        <path
                    key={`${label(stack)}.${index}`}
                    className="dot"
                    d={symbol()}
                    transform={translate}
                    fill={colorScale(label(stack))}
                    onMouseOver={ evt => { onMouseEnter(evt, e); } }
                    onMouseLeave={  evt => { onMouseLeave(evt); } }
                        />
                );
            });
        });

        return (
                <g>
                {circles}
            </g>
        );
    }
});

export default React.createClass({
    displayName: "ScatterPlot",

    mixins: [TooltipMixin],

    propTypes: {
        rScale: React.PropTypes.func,
        shape: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            rScale: null,
            shape: 'circle'
        };
    },

    _tooltipHtml(d, position) {
        let [xScale, yScale] = [this._xScale, this._yScale];

        let html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

        let xPos = xScale(this.props.x(d));
        let yPos = yScale(this.props.y(d));

        return [html, xPos, yPos];
    },

    render() {
        let {height,
             width,
             margin,
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
             xScale,
             yScale,
             xIntercept,
             yIntercept} = this.props;

        let symbol = d3.svg.symbol().type(shape);

        if (rScale) {
            symbol = symbol.size(rScale);
        }

        return (
                <g>
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
                { this.props.children }
                </g>
        );
    }
});
