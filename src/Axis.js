let React = require('react');
let d3 = require('d3');

let Axis = React.createClass({
	propTypes: {
		tickArguments: React.PropTypes.array,
		tickValues: React.PropTypes.array,
		tickFormat: React.PropTypes.func,
		innerTickSize: React.PropTypes.number,
		tickPadding: React.PropTypes.number,
		outerTickSize: React.PropTypes.number,
		scale: React.PropTypes.func.isRequired,
		className: React.PropTypes.string,
		zero: React.PropTypes.number,
		orientation: function(props, propName, componentName) {
			if (['top', 'bottom', 'left', 'right'].indexOf(props[propName]) == -1) {
				return new Error('Not a valid orientation!');
			}
		}
	},

	getDefaultProps() {
		return {
			tickArguments: [10],
			tickValues: null,
			tickFormat: x => { return x; },
			innerTickSize: 6,
			tickPadding: 3,
			outerTickSize: 6,
			className: "axis",
			zero: 0
		};
	},

	_getTranslateString() {
		let {orientation, height, width, zero} = this.props;

		if (orientation === "top") {
			return `translate(0, ${zero})`;
		} else if (orientation === "bottom") {
			return `translate(0, ${zero == 0 ? height : zero})`;
		} else if (orientation === "left") {
			return `translate(${zero}, 0)`;
		} else if (orientation === "right") {
			return `translate(${zero == 0 ? width : zero}, 0)`;
		} else {
			return "";
		}
	},

	render() {
		let {height,
			 width,
			 tickArguments,
			 tickValues,
			 tickFormat,
			 innerTickSize,
			 tickPadding,
			 outerTickSize,
			 scale,
			 orientation,
			 className,
			 zero} = this.props;

		let ticks = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues;

		if (scale.tickFormat) {
			tickFormat = scale.tickFormat.apply(scale, tickArguments);
		}

		// TODO: is there a cleaner way? removes the 0 tick if axes are crossing
		// try ticks=ticks.filter(d!=0) instead of tickFormat
		if (zero != height && zero != width && zero != 0) {
			let originalTickFormat = tickFormat;
			tickFormat = t => { if (t == 0) { return ""; } else { return originalTickFormat(t); } };
		}

		let tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

		let sign = orientation === "top" || orientation === "left" ? -1 : 1;

		let range = this._d3_scaleRange(scale);

		let activeScale = scale.rangeBand ? e => { return scale(e) + scale.rangeBand() / 2; } : scale;

		let tickElements;
		let pathElement;
		if (orientation === "bottom" || orientation === "top") {
			tickElements = ticks.map(tick => {
				return (
						<g className="tick" transform={`translate(${activeScale(tick)}, 0)`}>
						<line x2={0} y2={sign * innerTickSize}/>
						<text x={0} y={sign * tickSpacing} dy={sign < 0 ? "0em" : ".71em"} textAnchor="middle">
						{tickFormat(tick)}</text>
						</g>
				);
			});

			let d = `M${range[0]}, ${sign * outerTickSize}V0H${range[1]}V${sign * outerTickSize}`;
			pathElement = <path className="domain" d={d}/>;
		} else {
			tickElements = ticks.map(tick => {
				return (
						<g className="tick" transform={`translate(0, ${activeScale(tick)})`}>
						<line y2={0} x2={sign * innerTickSize}/>
						<text y={0} x={sign * tickSpacing} dy=".32em" textAnchor={sign < 0 ? "end" : "start"}>
						{tickFormat(tick)}</text>
						</g>
				);
			});

			let d = `M${sign * outerTickSize}, ${range[0]}H0V${range[1]}H${sign * outerTickSize}`;
			pathElement = <path className="domain" d={d}/>;
		}

		return (
				<g ref="axis" className={className} transform={this._getTranslateString()}>
				{tickElements}
			{pathElement}
			</g>
		);
	},

	_d3_scaleExtent(domain) {
		let start = domain[0], stop = domain[domain.length - 1];
		return start < stop ? [start, stop] : [stop, start];
	},

	_d3_scaleRange(scale) {
		return scale.rangeExtent ? scale.rangeExtent() : this._d3_scaleExtent(scale.range());
	}
});

module.exports = Axis;
