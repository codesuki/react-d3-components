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
		colorScale: React.PropTypes.func.isRequired
	},

	render() {
		let {data, xScale, yScale, colorScale, values, label, x, y, y0} = this.props;

		let bars = data.map(stack => {
			return values(stack).map(e => {
				return (
						<Bar
					x={xScale(x(e))}
					width={xScale.rangeBand()}
					y={yScale(y0(e) + y(e))}
					height={yScale(yScale.domain()[0]) - yScale(y(e))}
					fill={colorScale(label(stack))}
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
	mixins: [DefaultPropsMixin,
			 HeightWidthMixin,
			 ArrayifyMixin,
			 StackAccessorMixin,
			 StackDataMixin,
			 DefaultScalesMixin],

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
			 offset,
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
