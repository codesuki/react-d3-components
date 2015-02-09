var React = require('react');
var d3 = require('d3');

var Chart = require('./Chart');
var Axis = require('./Axis');

var DefaultPropsMixin = require('./DefaultPropsMixin');
var HeightWidthMixin = require('./HeightWidthMixin');
var ArrayifyMixin = require('./ArrayifyMixin');

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

	var circles = data.map(stack => {
	    return stack.values.map(e => {
		var translate = "translate(" + xScale(e.x) + ", " + yScale(e.y) + ")";
		return (
			<path
		    d={symbol()}
		    transform={translate}
		    fill={colorScale(stack.label)}
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

var ScatterPlot = React.createClass({
    mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin],

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
	    
	    // if we have no negative values set 0 as the minimum y-value to make the graph nicer
	    yExtents = [d3.min([0, yExtents[0]]), yExtents[1]];
	    
	    yScale = d3.scale.linear()
		.domain(yExtents)
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
