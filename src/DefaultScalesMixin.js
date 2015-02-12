let d3 = require('d3');

let DefaultScalesMixin = {
	componentWillMount() {
		let {xScale, yScale, x, y, values} = this.props;

		if (!this.props.xScale) {
			[this.props.xScale, this.props.xIntercept] = this._makeXScale();
		}

		if (!this.props.yScale) {
			[this.props.yScale, this.props.yIntercept] = this._makeYScale();
		}
	},

	componentWillReceiveProps(nextProps) {
	},

	_makeXScale() {
		let {data, x, values} = this.props;

		if (Number.isFinite(x(values(data[0])[0]))) {
			return this._makeLinearXScale();
		} else {
			return this._makeOrdinalXScale();
		}
	},

	_makeLinearXScale() {
		let {data, innerWidth, x, values} = this.props;

		let extents = d3.extent(Array.prototype.concat.apply([],
															 data.map(stack => {
																 return values(stack).map(e => {
																	 return x(e);
																 });
															 })));

		let scale = d3.scale.linear()
				.domain(extents)
				.range([0, innerWidth]);

		let zero = d3.max([0, scale.domain()[0]]);
		let xIntercept = scale(zero);

		return [scale, xIntercept];
	},

	_makeOrdinalXScale() {
		let {data, innerWidth, x, values, barPadding} = this.props;

		let scale = d3.scale.ordinal()
				.domain(values(data[0]).map(e => { return x(e); }))
				.rangeRoundBands([0, innerWidth], barPadding);

		return [scale, 0];
	},

	_makeYScale() {
		let {data, y, values} = this.props;

		if (Number.isFinite(y(values(data[0])[0]))) {
			return this._makeLinearYScale();
		} else {
			return this._makeOrdinalYScale();
		}
	},

	_makeLinearYScale() {
		let {data, innerHeight, y, y0, values} = this.props;

		let extents = d3.extent(Array.prototype.concat.apply([],
															 data.map(stack => {
																 return values(stack).map(e => {
																	 return y0(e) + y(e);
																 });
															 })));

		extents = [d3.min([0, extents[0]]), extents[1]];

		let scale = d3.scale.linear()
				.domain(extents)
				.range([innerHeight, 0]);

		let zero = d3.max([0, scale.domain()[0]]);
		let yIntercept = scale(zero);

		return [scale, yIntercept];
	},

	_makeOrdinalYScale() {
		return [null, 0];
	}
};

module.exports = DefaultScalesMixin;
