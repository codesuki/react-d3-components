let React = require('react');
let d3 = require('d3');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Bar = require('./Bar');
let Tooltip = require('./Tooltip');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');
let StackAccessorMixin = require('./StackAccessorMixin');
let StackDataMixin = require('./StackDataMixin');
let DefaultScalesMixin = require('./DefaultScalesMixin');
let TooltipMixin = require('./TooltipMixin');


 // receive array and return a subsampled array of size n
    //
    // a= the array;
    // n= number of sample you want output
let subSample = function(a, n) {
      var returnArray = [];
      var m = a.length;
      var samplingRatio = m / n;

      //just round down for now in case of comma separated
      for (var i = 0; i < m;) {
        returnArray.push(a[Math.floor(i)]);
        i += samplingRatio;
      }
      return returnArray;
    }

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
             x0,
             onMouseEnter,
             onMouseLeave} = this.props;
        let bars;
        let height = yScale(yScale.domain()[0]);
        bars = data.map((stack, serieIndex) => {
            return values(stack).map((e, index) => {
                // maps the range [0,1] to the range [0, yDomain]
                let yValue = height * y(e);
                // center vertically to have upper and lower part of the waveform
                let vy = height/2 - (yValue/2);
                //position x(e) * width * 2 because we want equal sapce.
                let vx = 2*x0*index;

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
            });
        });
        return (
            <g>{bars}</g>
        );
    }
});

let Waveform = React.createClass({
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
             groupedBars} = this.props;

        let [data,
             innerWidth,
             innerHeight,
             xScale,
             yScale] = [this._data,
                        this._innerWidth,
                        this._innerHeight,
                        this._xScale,
                        this._yScale];

        let preserveAspectRatio = "none";
        let viewBox = "0 0 "+width+" "+height;

        // there are two options, if the samples are less than the space available
        // we'll stretch the width of bar and inbetween spaces.
        // Otherwise we just subSample the dataArray.
        let barWidth;
        if(data[0].values.length > innerWidth/2){
            data[0].values = subSample(data[0].values,innerWidth/2);
            barWidth = 1;
        } else {
            barWidth = (innerWidth/2)/data[0].values.length;
        }

        return React.createElement(
            "div",
            null,
            React.createElement(
                Chart,
                { height: height, width: width, margin: margin, viewBox: viewBox, preserveAspectRatio: preserveAspectRatio},
                React.createElement(DataSet, {
                    data: data,
                    xScale: xScale,
                    yScale: yScale,
                    colorScale: colorScale,
                    label: label,
                    values: values,
                    x: x,
                    y: y,
                    y0: y0,
                    x0: barWidth,
                    onMouseEnter: this.onMouseEnter,
                    onMouseLeave: this.onMouseLeave
                }),
                this.props.children
            )
        );
    }
});


module.exports = Waveform;
