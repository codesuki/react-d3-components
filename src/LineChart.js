var React = require('react');
var d3 = require('d3');

var Chart = require('./Chart');
var Axis = require('./Axis');
var Path = require('./Path');

var DefaultPropsMixin = require('./DefaultPropsMixin');
var HeightWidthMixin = require('./HeightWidthMixin');

var LineChart = React.createClass({
    mixins: [DefaultPropsMixin, HeightWidthMixin],

    propTypes: {
	interpolate: React.PropTypes.string,
	strokeWidth: React.PropTypes.string,
	stroke: React.PropTypes.string
    },

    getDefaultProps() {
	return {
	    interpolate: 'linear',
	    strokeWidth: '2',
	    stroke: d3.scale.category20()()
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
	    xScale = d3.scale.linear()
		.domain([0, d3.max(data, function(e) { return e[0]; })])
		.range([0, innerWidth]);
	}

	if (!yScale) {
	    yScale = d3.scale.linear()
		.domain([0, d3.max(data, function(e) { return e[1]; })])
		.range([innerHeight, 0]);
	}

	var line = d3.svg.line()
	    .x(function(e) { return xScale(e[0]); })
	    .y(function(e) { return yScale(e[1]); })
	    .interpolate(interpolate);
	
	return (
	    <Chart height={height} width={width} margin={margin}>
		<Path
	    d={line(data)}
	    strokeWidth={strokeWidth}
	    stroke={stroke}
		/>

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
