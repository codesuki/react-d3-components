let React = require('react');
let d3 = require('d3');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Path = require('./Path');
let Tooltip = require('./Tooltip');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');
let StackAccessorMixin = require('./StackAccessorMixin');
let StackDataMixin = require('./StackDataMixin');
let DefaultScalesMixin = require('./DefaultScalesMixin');
let TooltipMixin = require('./TooltipMixin');

let DataSet = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        area: React.PropTypes.func.isRequired,
        line: React.PropTypes.func.isRequired,
        colorScale: React.PropTypes.func.isRequired,
        stroke: React.PropTypes.func.isRequired
    },

    render() {
        let {data,
             area,
             line,
             colorScale,
             stroke,
             values,
             label,
             onMouseEnter,
             onMouseLeave} = this.props;

        let areas = data.map((stack, index) => {
            return (
                    <Path
                key={`${label(stack)}.${index}`}
                className="area"
                stroke="none"
                fill={colorScale(label(stack))}
                d={area(values(stack))}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                data={data}
                    />
            );
        });

        let lines = data.map(stack => {
            return (
                    <Path
                className="line"
                d={line(values(stack))}
                stroke={stroke(label(stack))}
                    />
            );
        });

        return (
                <g>
                {areas}
            </g>
        );
    }
});

let AreaChart = React.createClass({
    mixins: [DefaultPropsMixin,
             HeightWidthMixin,
             ArrayifyMixin,
             StackAccessorMixin,
             StackDataMixin,
             DefaultScalesMixin,
             TooltipMixin],

    propTypes: {
        interpolate: React.PropTypes.string,
        stroke: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            interpolate: 'linear',
            stroke: d3.scale.category20()
        };
    },

    _tooltipHtml(d, position) {
        let {x, y0, y, values, label} = this.props;
        let [xScale, yScale] = [this._xScale, this._yScale];

        let xValueCursor = xScale.invert(position[0]);

        let xBisector = d3.bisector(e => { return x(e); }).right;
        let xIndex = xBisector(values(d[0]), xScale.invert(position[0]));
        xIndex = (xIndex == values(d[0]).length) ? xIndex - 1: xIndex;

        let xIndexRight = xIndex == values(d[0]).length ? xIndex - 1: xIndex;
        let xValueRight = x(values(d[0])[xIndexRight]);

        let xIndexLeft = xIndex == 0 ? xIndex : xIndex - 1;
        let xValueLeft = x(values(d[0])[xIndexLeft]);

        if (Math.abs(xValueCursor - xValueRight) < Math.abs(xValueCursor - xValueLeft)) {
            xIndex = xIndexRight;
        } else {
            xIndex = xIndexLeft;
        }

        let yValueCursor = yScale.invert(position[1]);

        let yBisector = d3.bisector(e => { return y0(values(e)[xIndex]) + y(values(e)[xIndex]); }).left;
        let yIndex = yBisector(d, yValueCursor);
        yIndex = (yIndex == d.length) ? yIndex - 1: yIndex;

        let yValue = y(values(d[yIndex])[xIndex]);
        let yValueCumulative = y0(values(d[d.length - 1])[xIndex]) + y(values(d[d.length - 1])[xIndex]);

        let xValue = x(values(d[yIndex])[xIndex]);

        let xPos = xScale(xValue);
        let yPos = yScale(y0(values(d[yIndex])[xIndex]) + yValue);

        return [this.props.tooltipHtml(yValue, yValueCumulative, xValue), xPos, yPos];
    },

    render() {
        let {height,
             width,
             margin,
             colorScale,
             interpolate,
             stroke,
             offset,
             values,
             label,
             x,
             y,
             y0,
             xAxis,
             yAxis} = this.props;

        let [data,
             innerWidth,
             innerHeight,
             xScale,
             yScale,
             xIntercept,
             yIntercept] = [this._data,
                            this._innerWidth,
                            this._innerHeight,
                            this._xScale,
                            this._yScale,
                            this._xIntercept,
                            this._yIntercept];

        let line = d3.svg.line()
                .x(function(e) { return xScale(x(e)); })
                .y(function(e) { return yScale(y0(e) + y(e)); })
                .interpolate(interpolate);

        let area = d3.svg.area()
                .x(function(e) { return xScale(x(e)); })
                .y0(function(e) { return yScale(yScale.domain()[0] + y0(e)); })
                .y1(function(e) { return yScale(y0(e) + y(e)); })
                .interpolate(interpolate);

        return (
            <div>
                <Chart height={height} width={width} margin={margin}>

                <DataSet
            data={data}
            line={line}
            area={area}
            colorScale={colorScale}
            stroke={stroke}
            label={label}
            values={values}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
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

module.exports = AreaChart;
