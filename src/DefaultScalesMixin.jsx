let React = require('react');
let d3 = require('d3');

let DefaultScalesMixin = {
	propTypes: {
		barPadding: React.PropTypes.number
	},

	getDefaultProps() {
		return {
			barPadding: 0.5
		};
	},

	componentWillMount() {
		this._makeScales(this.props);
	},

	componentWillReceiveProps(nextProps) {
		this._makeScales(nextProps);
	},

	_makeScales(props) {
		let {xScale, xIntercept, yScale, yIntercept} = props;

		if (!xScale) {
			[this._xScale, this._xIntercept] = this._makeXScale();
		} else {
			[this._xScale, this._xIntercept] = [xScale, xIntercept];
		}

		if (!yScale) {
			[this._yScale, this._yIntercept] = this._makeYScale();
		} else {
			[this._yScale, this._yIntercept] = [yScale, yIntercept];
		}
	},

	_makeXScale() {
		let {x, values} = this.props;
		let data = this._data;

		if (typeof (x(values(data[0])[0])) === 'number') {
			return this._makeLinearXScale();
		} else if (typeof x(values(data[0])[0]).getMonth === 'function') {
			return this._makeTimeXScale();
		} else {
			return this._makeOrdinalXScale();
		}
	},

	_makeLinearXScale() {
		let {x, values} = this.props;
		let [data, innerWidth] = [this._data, this._innerWidth];

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
		let {x, values, barPadding} = this.props;
		let [data, innerWidth] = [this._data, this._innerWidth];

		let scale = d3.scale.ordinal()
				.domain(values(data[0]).map(e => { return x(e); }))
				.rangeRoundBands([0, innerWidth], barPadding);

		return [scale, 0];
	},

	_makeTimeXScale() {
		let {x, values, barPadding} = this.props;
		let [data, innerWidth] = [this._data, this._innerWidth];

		let scale = d3.time.scale()
				.domain(values(data[0]).map(e => { return x(e); }))
				.range([0, innerWidth]);

		return [scale, 0];
	},

	_makeYScale() {
		let {y, values} = this.props;
		let data = this._data;

		if (typeof y(values(data[0])[0]) === 'number') {
			return this._makeLinearYScale();
		} else {
			return this._makeOrdinalYScale();
		}
	},

	_makeLinearYScale() {
		let {y, y0, values} = this.props;
		let [data, innerHeight] = [this._data, this._innerHeight];

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
		let [data, innerHeight] = [this._data, this._innerHeight];

		let scale = d3.scale.ordinal()
				.range([innerHeight, 0]);

		let yIntercept = scale(0);

		return [scale, yIntercept];
	}
};

module.exports = DefaultScalesMixin;
