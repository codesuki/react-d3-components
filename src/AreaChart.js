let React = require('./ReactProvider');
let d3 = require('./D3Provider');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Path = require('./Path');
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
		area: React.PropTypes.func.isRequired,
		line: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired,
		stroke: React.PropTypes.func.isRequired
	},

	render() {
		let {data,
			 area,
			 line,
			 colorScale,
			 stroke,
			 values,
			 label,
			 onMouseEnter,
			 onMouseLeave} = this.props;

		let areas = data.map(stack => {
			return (
					<Path
				className="area"
				stroke="none"
				fill={colorScale(label(stack))}
				d={area(values(stack))}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
					/>
			);
		});

		let lines = data.map(stack => {
			return (
					<Path
				className="line"
				d={line(values(stack))}
				stroke={stroke(label(stack))}
					/>
			);
		});

		return (
				<g>
				{areas}{lines}
			</g>
		);
	}
});

let AreaChart = React.createClass({
	mixins: [DefaultPropsMixin,
			 HeightWidthMixin,
			 ArrayifyMixin,
			 StackAccessorMixin,
			 StackDataMixin,
			 DefaultScalesMixin,
			 TooltipMixin],

	propTypes: {
		interpolate: React.PropTypes.string,
		stroke: React.PropTypes.func
	},

	getDefaultProps() {
		return {
			interpolate: 'linear',
			stroke: d3.scale.category20(),
			tooltipHtml: (d, position, xScale, yScale) => {
				return d3.round(yScale.invert(position[1]), 2);
			}
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
			 stroke,
			 offset,
			 xIntercept,
			 yIntercept,
			 values,
			 label,
			 x,
			 y,
			 y0} = this.props;

		let line = d3.svg.line()
				.x(function(e) { return xScale(x(e)); })
				.y(function(e) { return yScale(y0(e) + y(e)); })
				.interpolate(interpolate);

		let area = d3.svg.area()
				.x(function(e) { return xScale(x(e)); })
				.y0(function(e) { return yScale(yScale.domain()[0] + y0(e)); })
				.y1(function(e) { return yScale(y0(e) + y(e)); })
				.interpolate(interpolate);

		return (
			<div>
				<Chart height={height} width={width} margin={margin}>

				<DataSet
			data={data}
			line={line}
			area={area}
			colorScale={colorScale}
			stroke={stroke}
			label={label}
			values={values}
			onMouseEnter={this.onMouseEnter}
			onMouseLeave={this.onMouseLeave}
				/>

				<Axis
			className={"x axis"}
			orientation={"bottom"}
			scale={xScale}
			height={innerHeight}
			zero={yIntercept}
				/>

				<Axis
			className={"y axis"}
			orientation={"left"}
			scale={yScale}
			width={innerWidth}
			zero={xIntercept}
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

module.exports = AreaChart;
