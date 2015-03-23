let React = require('react');
let d3 = require('d3');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Bar = require('./Bar');
let Tooltip = require('./Tooltip');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');
let StackAccessorMixin = require('./StackAccessorMixin');
let StackDataMixin = require('./StackDataMixin');
let DefaultScalesMixin = require('./DefaultScalesMixin');
let TooltipMixin = require('./TooltipMixin');

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
		let {data,
			 xScale,
			 yScale,
			 colorScale,
			 values,
			 label,
			 x,
			 y,
			 y0,
			 onMouseEnter,
			 onMouseLeave} = this.props;

		let bars = data.map(stack => {
			return values(stack).map((e, index) => {
				return (
						<Bar
					key={`${label(stack)}.${index}`}
					width={xScale.rangeBand()}
					height={yScale(yScale.domain()[0]) - yScale(y(e))}
					x={xScale(x(e))}
					y={yScale(y0(e) + y(e))}
					fill={colorScale(label(stack))}
					data={e}
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
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
			 DefaultScalesMixin,
			 TooltipMixin],

	getDefaultProps() {
		return {};
	},

	_tooltipHtml(d, position) {
		return this.props.tooltipHtml(this.props.x(d), this.props.y0(d), this.props.y(d));
	},

	render() {
		let {height,
			 width,
			 margin,
			 colorScale,
			 values,
			 label,
			 y,
			 y0,
			 x,
			 xAxis,
			 yAxis} = this.props;

		let [data,
			 innerWidth,
			 innerHeight,
			 xScale,
			 yScale] = [this._data,
						this._innerWidth,
						this._innerHeight,
						this._xScale,
						this._yScale];

		return (
				<div>
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
			onMouseEnter={this.onMouseEnter}
			onMouseLeave={this.onMouseLeave}
				/>

				<Axis
			className={"x axis"}
			orientation={"bottom"}
			scale={xScale}
			height={innerHeight}
			width={innerWidth}
			{...xAxis}
				/>

				<Axis
			className={"y axis"}
			orientation={"left"}
			scale={yScale}
			height={innerHeight}
			width={innerWidth}
			{...yAxis}
				/>
				</Chart>

				<Tooltip
			hidden={this.state.tooltip.hidden}
			top={this.state.tooltip.top}
			left={this.state.tooltip.left}
			html={this.state.tooltip.html}/>
				</div>
		);
	}
});

module.exports = BarChart;
