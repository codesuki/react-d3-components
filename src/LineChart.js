let React = require('./ReactProvider');
let d3 = require('./D3Provider');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Path = require('./Path');
let Tooltip = require('./Tooltip');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');
let AccessorMixin = require('./AccessorMixin');
let DefaultScalesMixin = require('./DefaultScalesMixin');
let TooltipMixin = require('./TooltipMixin');

let DataSet = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		line: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired
	},

	render() {
		let {width,
			 height,
			 data,
			 line,
			 strokeWidth,
			 colorScale,
			 values,
			 label,
			 onMouseEnter,
			 onMouseLeave} = this.props;

		let lines = data.map(stack => {
			return (
					<Path
				className="line"
				d={line(values(stack))}
				stroke={colorScale(label(stack))}
				data={values(stack)}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
					/>
			);
		});

		/*
		 The <rect> below is needed in case we want to show the tooltip no matter where on the chart the mouse is.
		 Not sure if this should be used.
		 */
		/*
		<rect width={width} height={height} fill={"none"} stroke={"none"} style={{pointerEvents: "all"}}
			onMouseMove={ evt => { onMouseEnter(evt, data); } }
			onMouseLeave={  evt => { onMouseLeave(evt); } }
				/>
		 */
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
			 DefaultScalesMixin,
			 TooltipMixin],

	propTypes: {
		interpolate: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			interpolate: 'linear'
		};
	},

	/*
	 The code below supports finding the data values for the line closest to the mouse cursor.
	 Since it gets all events from the Rect overlaying the Chart the tooltip gets shown everywhere.
	 For now I don't want to use this method.
	 */
	/*
	 tooltipHtml: (d, position, xScale, yScale) => {
	 let xValueCursor = xScale.invert(position[0]);
	 let yValueCursor = yScale.invert(position[1]);

	 let xBisector = d3.bisector(e => { return e.x; }).left;
	 let valuesAtX = d.map(stack => {
	 let idx = xBisector(stack.values, xValueCursor);
	 return stack.values[idx];
	 });

	 valuesAtX.sort((a, b) => { return a.y - b.y; });

	 let yBisector = d3.bisector(e => { return e.y; }).left;
	 let yIndex = yBisector(valuesAtX, yValueCursor);

	 let yValue = valuesAtX[yIndex == valuesAtX.length ? yIndex - 1 : yIndex].y;

	 return `Value: ${yValue}`;
	 }
	 */
	_tooltipHtml(data, position) {
		let {x, y0, y, values, label, xScale, yScale} = this.props;

		let xValueCursor = xScale.invert(position[0]);
		let yValueCursor = yScale.invert(position[1]);

		let xBisector = d3.bisector(e => { return x(e); }).left;
		let xIndex = xBisector(data, xScale.invert(position[0]));

		let valueLeft = x(data[xIndex == data.length ? xIndex - 1 : xIndex]);
		let valueRight = x(data[xIndex == data.length ? xIndex - 1 : xIndex - 1]);

		let index;
		if (Math.abs(xValueCursor - valueLeft) < Math.abs(xValueCursor - valueRight)) {
			index = xIndex;
		} else {
			index = xIndex - 1;
		}

		let yValue = y(data[index == data.length ? index - 1 : index]);
		let cursorValue = d3.round(yScale.invert(position[1]), 2);

		return this.props.tooltipHtml(yValue, cursorValue);
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
			 y,
			 xAxis,
			 yAxis} = this.props;

		let line = d3.svg.line()
				.x(function(e) { return xScale(x(e)); })
				.y(function(e) { return yScale(y(e)); })
				.interpolate(interpolate);

		return (
				<div>
				<Chart height={height} width={width} margin={margin}>

				<DataSet
			height={innerHeight}
			width={innerWidth}
			data={data}
			line={line}
			strokeWidth={strokeWidth}
			colorScale={colorScale}
			values={values}
			label={label}
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

module.exports = LineChart;
