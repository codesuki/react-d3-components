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
	area: React.PropTypes.func.isRequired,
	line: React.PropTypes.func.isRequired,
	colorScale: React.PropTypes.func.isRequired,
	strokeWidth: React.PropTypes.string.isRequired,
	stroke: React.PropTypes.func.isRequired
    },
    
    render() {
	var {data, area, line, colorScale, strokeWidth, stroke} = this.props;
	
	var areas = data.map(stack => {
	    return (
		    <Path stroke="none" fill={colorScale(stack.label)} d={area(stack.values)}/>
	    );
	});

	var lines = data.map(stack => {
	    return (
		    <Path d={line(stack.values)} strokeWidth={strokeWidth} stroke={stroke(stack.label)}/>
	    );
	});
	
	return (
		<g>
		{areas}{lines}
		</g>
	);
    }
});

var AreaChart = React.createClass({
    mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin],

    propTypes: {
	interpolate: React.PropTypes.string,
	strokeWidth: React.PropTypes.string,
	stroke: React.PropTypes.func,
	offset: React.PropTypes.string

    },

    getDefaultProps() {
	return {
	    interpolate: 'linear',
	    strokeWidth: '2',
	    stroke: d3.scale.category20b(),
	    offset: 'zero'
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
	     stroke,
	     offset} = this.props;

	var stack = d3.layout.stack()
		.offset("zero")
		.x(e => { return e.x; })
		.y(e => { return e.y; })
		.values(e => { return e.values; });

	var stackedData = stack(data);

	if (!xScale) {
	    var xExtents = d3.extent(Array.prototype.concat.apply([],
								  stackedData.map(stack => {
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
								  stackedData.map(stack => {
								      return stack.values.map(e => {
									  return e.y0 + e.y;
								      });
								  })));
	    
	    // if we have no negative values set 0 as the minimum y-value to make the graph nicer
	    yExtents = [d3.min([0, yExtents[0]]), yExtents[1]];
	    
	    yScale = d3.scale.linear()
		.domain(yExtents)
		.range([innerHeight, 0]);
	}

	var line = d3.svg.line()
		.x(function(e) { return xScale(e.x); })
		.y(function(e) { return yScale(e.y0 + e.y); })
		.interpolate(interpolate);

	var area = d3.svg.area()
		.x(function(e) { return xScale(e.x); })
		.y0(function(e) { return yScale(yScale.domain()[0] + e.y0); })
		.y1(function(e) { return yScale(e.y0 + e.y); })
		.interpolate(interpolate);
	
	return (
		<Chart height={height} width={width} margin={margin}>
		
		<DataSet data={stackedData} line={line} area={area} colorScale={colorScale} strokeWidth={strokeWidth} stroke={stroke}/>
	    
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

module.exports = AreaChart;
