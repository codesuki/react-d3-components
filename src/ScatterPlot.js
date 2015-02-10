let React = require('react');
let d3 = require('d3');

let Chart = require('./Chart');
let Axis = require('./Axis');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');

let DataSet = React.createClass({
    propTypes: {
	data: React.PropTypes.array.isRequired,
	symbol: React.PropTypes.func.isRequired,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	colorScale: React.PropTypes.func.isRequired
    },
    
    render() {
	let {data, symbol, xScale, yScale, colorScale} = this.props;

	let circles = data.map(stack => {
	    return stack.values.map(e => {
		let translate = `translate(${xScale(e.x)}, ${yScale(e.y)})`;
		return (
			<path
		    className="dot"
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

let ScatterPlot = React.createClass({
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
	let {data,
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
	    let xExtents = d3.extent(Array.prototype.concat.apply([],
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
	    let yExtents = d3.extent(Array.prototype.concat.apply([],
								  data.map(stack => {
								      return stack.values.map(e => {
									  return e.y;
								      });
								  })));
	    
	    yScale = d3.scale.linear()
		.domain(yExtents)
		.range([innerHeight, 0]);
	}

	let symbol = d3.svg.symbol().type(shape);

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
