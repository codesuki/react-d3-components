var React = require('react');
var d3 = require('d3');

var Chart = require('./Chart');
var Axis = require('./Axis');
var Bar = require('./Bar');

var DefaultPropsMixin = require('./DefaultPropsMixin');
var HeightWidthMixin = require('./HeightWidthMixin');

var DataSet = React.createClass({
    propTypes: {
	data: React.PropTypes.array.isRequired,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	colorScale: React.PropTypes.func.isRequired
    },
    
    render() {
	var {data, xScale, yScale, colorScale} = this.props;

	var bars = data.map(e => {
	    return (
		    <Bar
		x={xScale(e[0])}
		width={xScale.rangeBand()}
		y={yScale(e[1])}
		height={yScale(yScale.domain()[0]) - yScale(e[1])}
		fill={colorScale(e[0])}
		    />
	    );
	});
			    
	return (
		<g>
		{bars}
		</g>
	);
    }
});

var BarChart = React.createClass({
    mixins: [DefaultPropsMixin, HeightWidthMixin],

    render() {
	var {data, height, width, innerHeight, innerWidth, margin, xScale, yScale, colorScale}
		= this.props;

	if (!xScale) {
	    xScale = d3.scale.ordinal()
		.domain(data.map(e => { return e[0]; }))
		.rangeRoundBands([0, innerWidth], 0.5);
	}

	if (!yScale) {
	    yScale = d3.scale.linear()
		.domain([0, d3.max(data, (e) => { return e[1]; })])
		.range([innerHeight, 0]);
	}

	return (
		<Chart height={height} width={width} margin={margin}>
		<DataSet
	    data={data}
	    xScale={xScale}
	    yScale={yScale}
	    colorScale={colorScale}
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

module.exports = BarChart;
