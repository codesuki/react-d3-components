let React = require('react');
let d3 = require('d3');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Path = require('./Path');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');
let AccessorMixin = require('./AccessorMixin');
let StackDataMixin = require('./StackDataMixin');
let DefaultScalesMixin = require('./DefaultScalesMixin');

let DataSet = React.createClass({
    propTypes: {
	data: React.PropTypes.array.isRequired,
	area: React.PropTypes.func.isRequired,
	line: React.PropTypes.func.isRequired,
	colorScale: React.PropTypes.func.isRequired,
	strokeWidth: React.PropTypes.string.isRequired,
	stroke: React.PropTypes.func.isRequired
    },
    
    render() {
	let {data, area, line, colorScale, strokeWidth, stroke} = this.props;
	
	let areas = data.map(stack => {
	    return (
		    <Path className="area" stroke="none" fill={colorScale(stack.label)} d={area(stack.values)}/>
	    );
	});

	let lines = data.map(stack => {
	    return (
		    <Path className="line" d={line(stack.values)} strokeWidth={strokeWidth} stroke={stroke(stack.label)}/>
	    );
	});
	
	return (
		<g>
		{areas}{lines}
		</g>
	);
    }
});

let AreaChart = React.createClass({
    mixins: [DefaultPropsMixin,
	     HeightWidthMixin,
	     ArrayifyMixin,
	     AccessorMixin,
	     StackDataMixin,
	     DefaultScalesMixin],

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
	let {data,
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
	     offset,
	     xIntercept,
	     yIntercept,
	     x,
	     y,
	     y0} = this.props;

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
		<Chart height={height} width={width} margin={margin}>
		
		<DataSet data={data} line={line} area={area} colorScale={colorScale} strokeWidth={strokeWidth} stroke={stroke}/>
	    
		<Axis
	    orientation="bottom"
	    scale={xScale}
	    height={innerHeight}
	    zero={yIntercept}
		/>
		
		<Axis
	    orientation="left"
	    scale={yScale}
	    width={innerWidth}
	    zero={xIntercept}
		/>
		</Chart>
	);
    }
});

module.exports = AreaChart;
