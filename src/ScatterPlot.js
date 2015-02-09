var React = require('react');
var d3 = require('d3');

var Chart = require('./Chart');
var Axis = require('./Axis');

var DefaultPropsMixin = require('./DefaultPropsMixin');
var HeightWidthMixin = require('./HeightWidthMixin');

var DataSet = React.createClass({
    propTypes: {
	data: React.PropTypes.array.isRequired,
	symbol: React.PropTypes.func.isRequired,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	colorScale: React.PropTypes.func.isRequired
    },
    
    render() {
	var {data, symbol, xScale, yScale, colorScale} = this.props;

	var circles = data.map(e => {
	    var translate = "translate(" + xScale(e[0]) + ", " + yScale(e[1]) + ")";
	    return (
		    <path
		d={symbol()}
		transform={translate}
		fill={colorScale(e[0])}
		    />
	    );
	});

	return (
		<g>
		{circles}
		</g>
	);
    }
});

var ScatterPlot = React.createClass({
    mixins: [DefaultPropsMixin, HeightWidthMixin],

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
	     rScale,
	     shape} = this.props;

	if (!xScale) {
	    xScale = d3.scale.linear()
		.domain(d3.extent(data, e => { return e[0]; }))
		.range([0, innerWidth]);
	}   

	if (!yScale) {
	    yScale = d3.scale.linear()
		.domain(d3.extent(data, e => { return e[1]; }))
		.range([innerHeight, 0]);
	}

	var symbol = d3.svg.symbol().type(shape);

	if (rScale) {
	    symbol = symbol.size(rScale);
	}

	return (
		<Chart height={height} width={width} margin={margin}>
		<DataSet
	    data={data}
	    xScale={xScale}
	    yScale={yScale}
	    colorScale={colorScale}
	    symbol={symbol}
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

module.exports = ScatterPlot;
