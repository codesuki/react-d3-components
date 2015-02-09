var React = require('react');
var d3 = require('d3');

var Chart = require('./Chart');
var Axis = require('./Axis');
var Bar = require('./Bar');

var DefaultPropsMixin = require('./DefaultPropsMixin');
var HeightWidthMixin = require('./HeightWidthMixin');
var ArrayifyMixin = require('./ArrayifyMixin');

var DataSet = React.createClass({
    propTypes: {
	data: React.PropTypes.array.isRequired,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	colorScale: React.PropTypes.func.isRequired
    },
    
    render() {
	var {data, xScale, yScale, colorScale} = this.props;

	var bars = data.map(stack => {
	    return stack.values.map(e => {
		return (
			<Bar
		    x={xScale(e.x)}
		    width={xScale.rangeBand()}
		    y={yScale(e.y0 + e.y)}
		    height={yScale(yScale.domain()[0]) - yScale(e.y)}
		    fill={colorScale(stack.label)}
			/>
		);
	    });
	});
			    
	return (
		<g>
		{bars}
		</g>
	);
    }
});

var BarChart = React.createClass({
    mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin],
    
    propTypes: {
	barPadding: React.PropTypes.number,
	offset: React.PropTypes.string
    },

    getDefaultProps() {
	return {
	    barPadding: 0.5,
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
	     barPadding,
	     offset} = this.props;

	var stack = d3.layout.stack()
		.offset(offset)
		.x(e => { return e.x; })
		.y(e => { return e.y; })
		.values(stack => { return stack.values; });

	var stackedData = stack(data);

	if (!xScale) {
	    xScale = d3.scale.ordinal()
		.domain(stackedData[0].values.map(e => { return e.x; }))
		.rangeRoundBands([0, innerWidth], barPadding);
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
