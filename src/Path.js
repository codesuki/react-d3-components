let React = require('./ReactProvider');
let d3 = require('./D3Provider');

let Path = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		stroke: React.PropTypes.string.isRequired,
		fill: React.PropTypes.string,
		d: React.PropTypes.string.isRequired
	},

	getDefaultProps() {
		return {
			className: 'path',
			fill: 'none'
		};
	},

	render() {
		let {className, stroke, fill, d} = this.props;

		return (
				<path className={className} strokeWidth={"2"} stroke={stroke} fill={fill} d={d}/>
		);
	}
});

module.exports = Path;
