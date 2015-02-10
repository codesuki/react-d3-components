var React = require('react');
var d3 = require('d3');

var Chart = require('./Chart');
var Axis = require('./Axis');
var Path = require('./Path');

var DefaultPropsMixin = require('./DefaultPropsMixin');
var HeightWidthMixin = require('./HeightWidthMixin');
var ArrayifyMixin = require('./ArrayifyMixin');

var DataSet = React.createClass({
    propTypes: {
	data: React.PropTypes.array.isRequired,
	line: React.PropTypes.func.isRequired,
	strokeWidth: React.PropTypes.string.isRequired,
	colorScale: React.PropTypes.func.isRequired
    },
    
    render() {
	var {data, line, strokeWidth, colorScale} = this.props;

	var lines = data.map(stack => {
	    return (
		    <Path className="line" d={line(stack.values)} strokeWidth={strokeWidth} stroke={colorScale(stack.label)}/>
	    );
	});
	    
	return (
		<g>
		{lines}
		</g>
	);
    }
});

var LineChart = React.createClass({
    mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin],

    propTypes: {
	interpolate: React.PropTypes.string,
	strokeWidth: React.PropTypes.string
    },

    getDefaultProps() {
	return {
	    interpolate: 'linear',
	    strokeWidth: '2'
	};
    },
    
    render() {
	var {data,
	     height,
	     width,
	     innerHeight,
	     innerWidth,
	     margin,
	     xScale,
	     yScale,
	     colorScale,
	     interpolate,
	     strokeWidth,
	     stroke} = this.props;

	if (!xScale) {
	    var xExtents = d3.extent(Array.prototype.concat.apply([],
								  data.map(stack => {
								      return stack.values.map(e => {
									  return e.x;
								      });
								  })));
	    xScale = d3.scale.linear()
		.domain(xExtents)
		.range([0, innerWidth]);
	}

	if (!yScale) {
	    var yExtents = d3.extent(Array.prototype.concat.apply([],
								  data.map(stack => {
								      return stack.values.map(e => {
									  return e.y;
								      });
								  })));
	    
	    yScale = d3.scale.linear()
		.domain(yExtents)
		.range([innerHeight, 0]);
	}

	var line = d3.svg.line()
		.x(function(e) { return xScale(e.x); })
		.y(function(e) { return yScale(e.y); })
		.interpolate(interpolate);
	
	return (
		<Chart height={height} width={width} margin={margin}>

		<DataSet data={data} line={line} strokeWidth={strokeWidth} colorScale={colorScale}/>

		<Axis
	    orientation="bottom"
	    scale={xScale}
	    height={innerHeight}
		/>
		
		<Axis
	    orientation="left"
	    scale={yScale}
	    width={innerWidth}
		/>
		</Chart>
	);
    }
});

module.exports = LineChart;
