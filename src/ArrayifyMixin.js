let ArrayifyMixin = {
	componentWillMount() {
		this._arrayify(this.props);
	},

	componentWillReceiveProps(nextProps) {
		this._arrayify(nextProps);
	},

	_arrayify(props) {
		if (!Array.isArray(props.data)) {
			this._data = [props.data];
		} else {
			this._data = props.data;
		}
	}
};

module.exports = ArrayifyMixin;
