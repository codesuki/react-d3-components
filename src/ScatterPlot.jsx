let React = require('react');
let d3 = require('d3');

let Chart = require('./Chart');
let Axis = require('./Axis');
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
		symbol: React.PropTypes.func.isRequired,
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired,
		onMouseEnter: React.PropTypes.func,
		onMouseLeave: React.PropTypes.func
	},

	render() {
		let {data,
			 symbol,
			 xScale,
			 yScale,
			 colorScale,
			 label,
			 values,
			 x,
			 y,
			 onMouseEnter,
			 onMouseLeave} = this.props;

		let circles = data.map(stack => {
			return values(stack).map((e, index) => {
				let translate = `translate(${xScale(x(e))}, ${yScale(y(e))})`;
				return (
						<path
					key={`${label(stack)}.${index}`}
					className="dot"
					d={symbol()}
					transform={translate}
					fill={colorScale(label(stack))}
					onMouseOver={ evt => { onMouseEnter(evt, e); } }
					onMouseLeave={  evt => { onMouseLeave(evt); } }
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
	mixins: [DefaultPropsMixin,
			 HeightWidthMixin,
			 ArrayifyMixin,
			 AccessorMixin,
			 DefaultScalesMixin,
			 TooltipMixin],

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

	_tooltipHtml(d, position) {
        let [xScale, yScale] = [this._xScale, this._yScale];

        let html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

        let xPos = xScale(this.props.x(d));
        let yPos = yScale(this.props.y(d));

        return [html, xPos, yPos];
	},

	render() {
		let {height,
			 width,
			 margin,
			 colorScale,
			 rScale,
			 shape,
			 label,
			 values,
			 x,
			 y,
			 xAxis,
			 yAxis} = this.props;

		let [data,
			 innerWidth,
			 innerHeight,
			 xScale,
			 yScale,
			 xIntercept,
			 yIntercept] = [this._data,
							this._innerWidth,
							this._innerHeight,
							this._xScale,
							this._yScale,
							this._xIntercept,
							this._yIntercept];

		let symbol = d3.svg.symbol().type(shape);

		if (rScale) {
			symbol = symbol.size(rScale);
		}

		return (
			<div>
				<Chart height={height} width={width} margin={margin}>
				<Axis
			className={"x axis"}
			orientation="bottom"
			scale={xScale}
			height={innerHeight}
			width={innerWidth}
			zero={yIntercept}
			{...xAxis}
				/>

				<Axis
			className={"y axis"}
			orientation="left"
			scale={yScale}
			height={innerHeight}
			width={innerWidth}
			zero={xIntercept}
			{...yAxis}
				/>

				<DataSet
			data={data}
			xScale={xScale}
			yScale={yScale}
			colorScale={colorScale}
			symbol={symbol}
			label={label}
			values={values}
			x={x}
			y={y}
			onMouseEnter={this.onMouseEnter}
			onMouseLeave={this.onMouseLeave}
				/>
				{ this.props.children }
				</Chart>

                <Tooltip {...this.state.tooltip}/>
				</div>
		);
	}
});

module.exports = ScatterPlot;
