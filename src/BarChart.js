let React = require('react');
let d3 = require('d3');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Bar = require('./Bar');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');

let DataSet = React.createClass({
    propTypes: {
	data: React.PropTypes.array.isRequired,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	colorScale: React.PropTypes.func.isRequired
    },
    
    render() {
	let {data, xScale, yScale, colorScale} = this.props;

	let bars = data.map(stack => {
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

let BarChart = React.createClass({
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
	let {data,
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

	let stack = d3.layout.stack()
		.offset(offset)
		.x(e => { return e.x; })
		.y(e => { return e.y; })
		.values(stack => { return stack.values; });

	let stackedData = stack(data);

	if (!xScale) {
	    xScale = d3.scale.ordinal()
		.domain(stackedData[0].values.map(e => { return e.x; }))
		.rangeRoundBands([0, innerWidth], barPadding);
	}

	if (!yScale) {
	    let yExtents = d3.extent(Array.prototype.concat.apply([],
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
