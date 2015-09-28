let React = require('react');
let d3 = require('d3');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Path = require('./Path');
let Tooltip = require('./Tooltip');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');
let AccessorMixin = require('./AccessorMixin');
let DefaultScalesMixin = require('./DefaultScalesMixin');
let TooltipMixin = require('./TooltipMixin');

let DataSet = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        line: React.PropTypes.func.isRequired,
        colorScale: React.PropTypes.func.isRequired
    },

    render() {
        let {width,
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
             onMouseLeave} = this.props;

        let sizeId = width + 'x' + height;

        let lines = data.map((stack, index) => {
            return (
                    <Path
                key={`${label(stack)}.${index}`}
                className={'line'}
                d={line(values(stack))}
                stroke={colorScale(label(stack))}
                strokeWidth={typeof strokeWidth === 'function' ? strokeWidth(label(stack)) : strokeWidth}
                strokeLinecap={typeof strokeLinecap === 'function' ? strokeLinecap(label(stack)) : strokeLinecap}
                strokeDasharray={typeof strokeDasharray === 'function' ? strokeDasharray(label(stack)) : strokeDasharray}
                data={values(stack)}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={{clipPath: `url(#lineClip_${sizeId})`}}
                    />
            );
        });

        /*
         The <rect> below is needed in case we want to show the tooltip no matter where on the chart the mouse is.
         Not sure if this should be used.
         */
        let rect = React.renderToString(<rect width={width} height={height}/>);
        return (
                <g>
                <g dangerouslySetInnerHTML={{__html: `<defs><clipPath id="lineClip_${sizeId}">${rect}`}}/>
                {lines}
                <rect width={width} height={height} fill={'none'} stroke={'none'} style={{pointerEvents: 'all'}}
            onMouseMove={ evt => { onMouseEnter(evt, data); } }
            onMouseLeave={  evt => { onMouseLeave(evt); } }
                />
            </g>
        );
    }
});

let LineChart = React.createClass({
    mixins: [DefaultPropsMixin,
             HeightWidthMixin,
             ArrayifyMixin,
             AccessorMixin,
             DefaultScalesMixin,
             TooltipMixin],

    propTypes: {
        interpolate: React.PropTypes.string,
        defined: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            interpolate: 'linear',
            defined: () => true,
            shape: 'circle',
            shapeColor: null
        };
    },

    /*
     The code below supports finding the data values for the line closest to the mouse cursor.
     Since it gets all events from the Rect overlaying the Chart the tooltip gets shown everywhere.
     For now I don't want to use this method.
     */
    _tooltipHtml(data, position) {
        let {x, y0, y, values, label} = this.props;
        let [xScale, yScale] = [this._xScale, this._yScale];

        let xValueCursor = xScale.invert(position[0]);
        let yValueCursor = yScale.invert(position[1]);

        let xBisector = d3.bisector(e => { return x(e); }).left;
        let valuesAtX = data.map(stack => {
            let idx = xBisector(values(stack), xValueCursor);

            let indexRight = idx === values(stack).length ? idx - 1 : idx;
            let valueRight = x(values(stack)[indexRight]);

            let indexLeft = idx === 0 ? idx : idx - 1;
            let valueLeft = x(values(stack)[indexLeft]);

            let index;
            if (Math.abs(xValueCursor - valueRight) < Math.abs(xValueCursor - valueLeft)) {
                index = indexRight;
            } else {
                index = indexLeft;
            }

            return { label: label(stack), value: values(stack)[index] };
        });

        valuesAtX.sort((a, b) => { return y(a.value) - y(b.value); });

        let yBisector = d3.bisector(e => { return y(e.value); }).left;
        let yIndex = yBisector(valuesAtX, yValueCursor);

        let yIndexRight = yIndex === valuesAtX.length ? yIndex - 1 : yIndex;
        let yIndexLeft = yIndex === 0 ? yIndex : yIndex - 1;

        let yValueRight = y(valuesAtX[yIndexRight].value);
        let yValueLeft = y(valuesAtX[yIndexLeft].value);

        let index;
        if (Math.abs(yValueCursor - yValueRight) < Math.abs(yValueCursor - yValueLeft)) {
            index = yIndexRight;
        } else {
            index = yIndexLeft;
        }

        this._tooltipData = valuesAtX[index];

        let html = this.props.tooltipHtml(valuesAtX[index].label,
                                          valuesAtX[index].value);

        let xPos = xScale(valuesAtX[index].value.x);
        let yPos = yScale(valuesAtX[index].value.y);
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
        let {height,
             width,
             margin,
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
             shapeColor} = this.props;

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
                .y(function(e) { return yScale(y(e)); })
                .interpolate(interpolate)
                .defined(defined);

        let tooltipSymbol;
        if (!this.state.tooltip.hidden) {
            let symbol = d3.svg.symbol().type(shape);
            let symbolColor = shapeColor ? shapeColor : colorScale(this._tooltipData.label);

            let translate = this._tooltipData ? `translate(${xScale(x(this._tooltipData.value))}, ${yScale(y(this._tooltipData.value))})` : "";
            tooltipSymbol = this.state.tooltip.hidden ? null :
                <path
            className="dot"
            d={symbol()}
            transform={translate}
            fill={symbolColor}
            onMouseEnter={evt => { this.onMouseEnter(evt, data); }}
            onMouseLeave={evt => { this.onMouseLeave(evt); }}
                />;
        }

        return (
                <div>
                <Chart height={height} width={width} margin={margin}>

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

                <Axis
            className={'x axis'}
            orientation={'bottom'}
            scale={xScale}
            height={innerHeight}
            width={innerWidth}
            zero={yIntercept}
            {...xAxis}
                />

                <Axis
            className={'y axis'}
            orientation={'left'}
            scale={yScale}
            height={innerHeight}
            width={innerWidth}
            zero={xIntercept}
            {...yAxis}
                />
                { this.props.children }
                {tooltipSymbol}

                </Chart>

                <Tooltip {...this.state.tooltip}/>
            </div>
        );
    }
});

module.exports = LineChart;
