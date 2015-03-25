let React = require('react');
let d3 = require('d3');

let Tooltip = React.createClass({
	propTypes: {
		top: React.PropTypes.number.isRequired,
		left: React.PropTypes.number.isRequired,
		html: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			top: 150,
			left: 100,
			html: ""
		};
	},

	render() {
		let {top, left, hidden, html} = this.props;

		let style = {
			display: hidden ? "none" : "block",
			position: "fixed",
			top: top,
			left: left
		};

		return (
				<div className="tooltip" style={style}>{html}</div>
		);
	}
});

module.exports = Tooltip;
