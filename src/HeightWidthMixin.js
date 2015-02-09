var HeightWidthMixin = {
    componentWillMount() {
	var {height, width, margin} = this.props;
	this.props.innerHeight = height - margin.top - margin.bottom;
	this.props.innerWidth = width - margin.left - margin.right;
    },
    
    componentWillReceiveProps(nextProps) {
	console.log("componentWillReceiveProps");
	console.log(nextProps);
    }
};

module.exports = HeightWidthMixin;
