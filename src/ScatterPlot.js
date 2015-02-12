let React = require('react');
let d3 = require('d3');

let Chart = require('./Chart');
let Axis = require('./Axis');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');
let AccessorMixin = require('./AccessorMixin');
let DefaultScalesMixin = require('./DefaultScalesMixin');

let DataSet = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		symbol: React.PropTypes.func.isRequired,
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired
	},

	render() {
		let {data, symbol, xScale, yScale, colorScale, values, x, y} = this.props;

		let circles = data.map(stack => {
			return values(stack).map(e => {
				let translate = `translate(${xScale(x(e))}, ${yScale(y(e))})`;
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
	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, AccessorMixin, DefaultScalesMixin],

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
			 shape,
			 xIntercept,
			 yIntercept,
			 values,
			 x,
			 y} = this.props;

		let symbol = d3.svg.symbol().type(shape);

		if (rScale) {
			symbol = symbol.size(rScale);
		}

		return (
				<Chart height={height} width={width} margin={margin}>
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

				<DataSet
			data={data}
			xScale={xScale}
			yScale={yScale}
			colorScale={colorScale}
			symbol={symbol}
			values={values}
			x={x}
			y={y}
				/>
				</Chart>
		);
	}
});

module.exports = ScatterPlot;
