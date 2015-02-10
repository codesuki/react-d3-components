let ArrayifyMixin = {
    componentWillMount() {
	if (!Array.isArray(this.props.data)) {
	    this.props.data = [this.props.data];
	}
    },
    
    componentWillReceiveProps(nextProps) {

    }
};

module.exports = ArrayifyMixin;
