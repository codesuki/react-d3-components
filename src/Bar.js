let React = require('./ReactProvider');
let d3 = require('./D3Provider');

let Bar = React.createClass({
	propTypes: {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		x: React.PropTypes.number.isRequired,
		y: React.PropTypes.number.isRequired,
		fill: React.PropTypes.string.isRequired
	},

	render() {
		let {x, y, width, height, fill} = this.props;

		return (
				<rect className="bar" x={x} y={y} width={width} height={height} fill={fill}/>
		);
	}
});

module.exports = Bar;
