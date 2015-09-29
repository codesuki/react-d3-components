import d3 from 'd3';

export default {
	_transition() {
		for (let key in this.props.transition.attributes()) {
			let attr = this.props.transition.attributes()[key];

			let interpolator = undefined;
			if (attr.tween) {
				// TODO: what to pass to the tween depends on the graph, so need to think of something here.
				interpolator = attr.tween(this.props.e, this.props.arc);
			} else {
				let startVal = typeof attr.start === 'function' ?
						attr.start.call(this,
										this.props.data,
										this.props.xScale,
										this.props.yScale) : attr.start;

				let endVal = typeof attr.end === 'function' ?
						attr.end.call(this,
									  this.props.data,
									  this.props.xScale,
									  this.props.yScale) : attr.end;

				interpolator = d3.interpolate(startVal !== undefined ? startVal : this.state[key], endVal);
			}

			d3.timer((elapsed) => {
				let t = elapsed / this.props.transition.duration();

				let state = {};
				state[key] = interpolator(this.props.transition.ease()(t));
				this.setState(state);

				if (t > 1) {
					return true;
				}

				return false;
			}, this.props.transition.delay());
		}
	},

	componentDidMount() {
		if (this.props.transition) {
			this._transition();
		}
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.transition && JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
			this._transition();
		}
	}
};
