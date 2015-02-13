let React = require('./ReactProvider');
let d3 = require('./D3Provider');

let StackDataMixin = {
	propTypes: {
		offset: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			offset: 'zero'
		};
	},

	componentWillMount() {
		let {data, offset, x, y, values} = this.props;

		let stack = d3.layout.stack()
				.offset(offset)
				.x(x)
				.y(y)
				.values(values);

		this.props.data = stack(data);
	}
};

module.exports = StackDataMixin;
