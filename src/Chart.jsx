import React from 'react';

import DefaultPropsMixin from './DefaultPropsMixin';
import HeightWidthMixin from './HeightWidthMixin';
import ArrayifyMixin from './ArrayifyMixin';
import AccessorMixin from './AccessorMixin';
import DefaultScalesMixin from './DefaultScalesMixin';
import TooltipMixin from './TooltipMixin';

export default React.createClass({
	displayName: "Chart",

	mixins: [DefaultPropsMixin,
			 HeightWidthMixin,
			 ArrayifyMixin,
			 AccessorMixin,
			 DefaultScalesMixin],

	propTypes: {
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		margin: React.PropTypes.shape({
			top: React.PropTypes.number,
			bottom: React.PropTypes.number,
			left: React.PropTypes.number,
			right: React.PropTypes.number
		}).isRequired
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

		console.log(this.props.children);
		// dont send the same stuff to all components, maybe use propTypes, iterate over and only use the ones needed.
		// dont replace props if already set.
		let children = React.Children.map(this.props.children, function (child) {
			console.log(child);

			// if (child == axis)
			// if (child.props.scale = "x")
			// if (child.props.scale = "y")
			return React.cloneElement(child, {
				data: data,
				height: innerHeight,
				width: innerWidth,
				xScale: xScale,
				yScale: yScale,
				xIntercept: xIntercept,
				yIntercept: yIntercept,
				values: values,
				label: label,
				x: x,
				y: y,
				colorScale: colorScale,
				scale: child.props.scale === "x" ? xScale : child.props.scale === "y" ? yScale : child.props.scale
			});
		}, this);

		return (
				<svg ref="svg" width={width} height={height}>
				<g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
				</svg>
		);
	}
});
