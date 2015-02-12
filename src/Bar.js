let React = require('react');
let d3 = require('d3');

let Bar = React.createClass({
	propTypes: {
		x: React.PropTypes.number.isRequired,
		y: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		fill: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			fill: '#000'
		};
	},

	render() {
		let {x, y, width, height, fill} = this.props;

		return (
				<rect className="bar" x={x} y={y} width={width} height={height} fill={fill}/>
		);
	}
});

module.exports = Bar;
