let React = require('./ReactProvider');
let d3 = require('./D3Provider');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Bar = require('./Bar');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');
let StackAccessorMixin = require('./StackAccessorMixin');
let StackDataMixin = require('./StackDataMixin');
let DefaultScalesMixin = require('./DefaultScalesMixin');

let DataSet = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired,
		values: React.PropTypes.func.isRequired,
		label: React.PropTypes.func.isRequired,
		x: React.PropTypes.func.isRequired,
		y: React.PropTypes.func.isRequired,
		y0: React.PropTypes.func.isRequired
	},

	render() {
		let {data, xScale, yScale, colorScale, values, label, x, y, y0} = this.props;

		let bars = data.map(stack => {
			return values(stack).map(e => {
				return (
						<Bar
					width={xScale.rangeBand()}
					height={yScale(yScale.domain()[0]) - yScale(y(e))}
					x={xScale(x(e))}
					y={yScale(y0(e) + y(e))}
					fill={colorScale(label(stack))}
						/>
				);
			});
		});

		return (
				<g>{bars}</g>
		);
	}
});

let BarChart = React.createClass({
	mixins: [DefaultPropsMixin,
			 HeightWidthMixin,
			 ArrayifyMixin,
			 StackAccessorMixin,
			 StackDataMixin,
			 DefaultScalesMixin],

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
			 values,
			 label,
			 y,
			 y0,
			 x} = this.props;

		return (
				<Chart height={height} width={width} margin={margin}>
				<DataSet
			data={data}
			xScale={xScale}
			yScale={yScale}
			colorScale={colorScale}
			values={values}
			label={label}
			y={y}
			y0={y0}
			x={x}
				/>

				<Axis
			className={"x axis"}
			orientation={"bottom"}
			scale={xScale}
			height={innerHeight}
				/>

				<Axis
			className={"y axis"}
			orientation={"left"}
			scale={yScale}
			width={innerWidth}
				/>
				</Chart>
		);
	}
});

module.exports = BarChart;
