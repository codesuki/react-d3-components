let React = require('react');
let d3 = require('d3');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Path = require('./Path');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');
let AccessorMixin = require('./AccessorMixin');
let DefaultScalesMixin = require('./DefaultScalesMixin');

let DataSet = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		line: React.PropTypes.func.isRequired,
		strokeWidth: React.PropTypes.string.isRequired,
		colorScale: React.PropTypes.func.isRequired
	},

	render() {
		let {data, line, strokeWidth, colorScale, values, label} = this.props;

		let lines = data.map(stack => {
			return (
					<Path className="line" d={line(values(stack))} strokeWidth={strokeWidth} stroke={colorScale(label(stack))}/>
			);
		});

		return (
				<g>
				{lines}
			</g>
		);
	}
});

let LineChart = React.createClass({
	mixins: [DefaultPropsMixin,
			 HeightWidthMixin,
			 ArrayifyMixin,
			 AccessorMixin,
			 DefaultScalesMixin],

	propTypes: {
		interpolate: React.PropTypes.string,
		strokeWidth: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			interpolate: 'linear',
			strokeWidth: '2'
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
			 values,
			 label,
			 x,
			 y} = this.props;

		let line = d3.svg.line()
				.x(function(e) { return xScale(x(e)); })
				.y(function(e) { return yScale(y(e)); })
				.interpolate(interpolate);

		return (
				<Chart height={height} width={width} margin={margin}>

				<DataSet
			data={data}
			line={line}
			strokeWidth={strokeWidth}
			colorScale={colorScale}
			values={values}
			label={label}
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

module.exports = LineChart;
