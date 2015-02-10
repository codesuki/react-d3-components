var React = require('react');
var d3 = require('d3');

var Bar = React.createClass({
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
	var {x, y, width, height, fill} = this.props;
	
	return (
		<rect className="bar" x={x} y={y} width={width} height={height} fill={fill}/>
	);
    }
});

module.exports = Bar;
