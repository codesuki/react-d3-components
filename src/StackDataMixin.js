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
		this._stackData(this.props);
	},

	componentWillReceiveProps(nextProps) {
		this._stackData(nextProps);
	},

	_stackData(props) {
		let {offset, x, y, values} = this.props;

		let stack = d3.layout.stack()
				.offset(offset)
				.x(x)
				.y(y)
				.values(values);

		this._data = stack(this._data);
	}
};

module.exports = StackDataMixin;
