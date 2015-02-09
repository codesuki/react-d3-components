var React = require('react');
var d3 = require('d3');

var Axis = React.createClass({
    propTypes: {
	tickArguments: React.PropTypes.array,
	tickValues: React.PropTypes.array,
	tickFormat: React.PropTypes.func,
	innerTickSize: React.PropTypes.number,
	tickPadding: React.PropTypes.number,
	outerTickSize: React.PropTypes.number,
	scale: React.PropTypes.func.isRequired,
	orientation: function(props, propName, componentName) {
	    if (['top', 'bottom', 'left', 'right'].indexOf(props[propName]) == -1) {
		return new Error('Not a valid orientation!');
	    }
	}
    },
    
    getDefaultProps() {
	return {
	    tickArguments: [10],
	    tickValues: null,
	    tickFormat: x => { return x; },
	    innerTickSize: 6,
	    tickPadding: 3,
	    outerTickSize: 6
	};
    },
    
    _getTranslateString() {
	if (this.props.orientation === "bottom") {
	    return "translate(0," + this.props.height + ")";
	} else if (this.props.orientation === "right") {
	    return "translate(" + this.props.width  + ", 0)";
	} else {
	    return "";
	}
    },

    render() {
	var {tickArguments, tickValues, tickFormat, innerTickSize, tickPadding, outerTickSize, scale, orientation} = this.props;
	
	var ticks = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues;

	if (scale.tickFormat) {
	    tickFormat = scale.tickFormat.apply(scale, tickArguments);
	}

	var tickSpacing = Math.max(innerTickSize, 0) + tickPadding;
	
	var sign = orientation === "top" || orientation === "left" ? -1 : 1;
	
	var range = this._d3_scaleRange(scale);

	var activeScale = scale.rangeBand ? e => { return scale(e) + scale.rangeBand() / 2; } : scale;

	var tickElements;
	var pathElement;
	if (orientation === "bottom" || orientation === "top") {
	    tickElements = ticks.map(tick => {
		return (
			<g className="tick" transform={"translate(" + activeScale(tick) + ",0)"}>
			<line x2={0} y2={sign * innerTickSize}/>
			<text x={0} y={sign * tickSpacing} dy={sign < 0 ? "0em" : ".71em"} textAnchor="middle">
			{tickFormat(tick)}</text>
			</g>
		);
	    });

	    pathElement = <path className="domain" d={"M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize}/>;
	} else {
	    tickElements = ticks.map(tick => {
		return (
			<g className="tick" transform={"translate(0, " + activeScale(tick) + ")"}>
			<line y2={0} x2={sign * innerTickSize}/>
			<text y={0} x={sign * tickSpacing} dy=".32em" textAnchor={sign < 0 ? "end" : "start"}>
			{tickFormat(tick)}</text>
			</g>
		);
	    });

	    pathElement = <path className="domain" d={"M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize}/>;
	}
	
	return (
		<g ref="axis" className="axis" transform={this._getTranslateString()}>
		{tickElements}
	        {pathElement}
		</g>
	);
    },

    _d3_scaleExtent(domain) {
	var start = domain[0], stop = domain[domain.length - 1];
	return start < stop ? [start, stop] : [stop, start];
    },
    
    _d3_scaleRange(scale) {
	return scale.rangeExtent ? scale.rangeExtent() : this._d3_scaleExtent(scale.range());
    }
});

module.exports = Axis;
