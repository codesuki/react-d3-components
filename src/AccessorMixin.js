let React = require('./ReactProvider');

let AccessorMixin = {
	propTypes: {
		label: React.PropTypes.func,
		values: React.PropTypes.func,
		x: React.PropTypes.func,
		y: React.PropTypes.func,
		y0: React.PropTypes.func
	},

	getDefaultProps() {
		return {
			label: stack => { return stack.label; },
			values: stack => { return stack.values; },
			x: e => { return e.x; },
			y: e => { return e.y; },
			y0: e => {
				if (e.hasOwnProperty('y0')) {
					return e.y0;
				} else {
					return 0;
				}
			}
		};
	}
};

module.exports = AccessorMixin;
