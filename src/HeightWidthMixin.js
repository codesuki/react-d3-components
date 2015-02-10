let HeightWidthMixin = {
    componentWillMount() {
	let {height, width, margin} = this.props;
	this.props.innerHeight = height - margin.top - margin.bottom;
	this.props.innerWidth = width - margin.left - margin.right;
    },
    
    componentWillReceiveProps(nextProps) {
    }
};

module.exports = HeightWidthMixin;
