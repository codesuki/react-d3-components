let d3 = require('./D3Provider');

let StackDataMixin = {
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
