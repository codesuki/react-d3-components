var React = require('react');

var Chart = React.createClass({
    propTypes: {
	height: React.PropTypes.number.isRequired,
	width: React.PropTypes.number.isRequired,
	margin: React.PropTypes.shape({
	    top: React.PropTypes.number,
	    bottom: React.PropTypes.number,
	    left: React.PropTypes.number,
	    right: React.PropTypes.number
	}).isRequired
    },

    render() {
	return (
		<svg ref="svg" width={this.props.width} height={this.props.height}>
		<g transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`}>
		{this.props.children}
	        </g>
		</svg>
	);
    }
});

module.exports = Chart;
