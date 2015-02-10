var React = require('react');
var d3 = require('d3');

var DefaultPropsMixin = require('./DefaultPropsMixin');
var HeightWidthMixin = require('./HeightWidthMixin');

var Chart = require('./Chart');

var Wedge = React.createClass({
    propTypes: {
	d: React.PropTypes.string.isRequired,
	fill: React.PropTypes.string.isRequired
    },
    
    render() {
	var {fill, d} = this.props;
	
	return (
		<path fill={fill} d={d}/>
	);
    }
});

var DataSet = React.createClass({
    propTypes: {
	pie: React.PropTypes.array.isRequired,
	arc: React.PropTypes.func.isRequired,
	outerArc: React.PropTypes.func.isRequired,
	colorScale: React.PropTypes.func.isRequired,
	radius: React.PropTypes.number.isRequired,
	strokeWidth: React.PropTypes.number.isRequired,
	stroke: React.PropTypes.string.isRequired,
	fill: React.PropTypes.string.isRequired,
	opacity: React.PropTypes.number.isRequired
    },
    
    render() {
	var {pie, arc, outerArc, colorScale, radius, strokeWidth, stroke, fill, opacity} = this.props;
	
	var wedges = pie.map(e => {
	    function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	    }
	    
	    var d = arc(e);

	    var labelPos = outerArc.centroid(e);
	    labelPos[0] = radius * (midAngle(e) < Math.PI ? 1 : -1);
	    
	    var textAnchor = midAngle(e) < Math.PI ? "start" : "end";
	    
	    var linePos = outerArc.centroid(e);
	    linePos[0] = radius * 0.95 * (midAngle(e) < Math.PI ? 1 : -1);
	    
	    return (
		    <g className="arc">
		    <Wedge fill={colorScale(e.data.x)} d={d}/>
		    <polyline opacity={opacity} strokeWidth={strokeWidth} stroke={stroke} fill={fill} points={[arc.centroid(e), outerArc.centroid(e), linePos]}/>
		    <text dy=".35em" x={labelPos[0]} y={labelPos[1]} textAnchor={textAnchor}>{e.data.x}</text>	
		    </g>
	    );
	});
	
	return (
		<g>
		{wedges}
		</g>
	);
    }
});

var PieChart = React.createClass({
    mixins: [DefaultPropsMixin, HeightWidthMixin],

    propTypes: {
	innerRadius: React.PropTypes.number,
	outerRadius: React.PropTypes.number,
	labelRadius: React.PropTypes.number,
	strokeWidth: React.PropTypes.number,
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string,
	opacity: React.PropTypes.number
    },
    
    getDefaultProps() {
	return {
	    innerRadius: null,
	    outerRadius: null,
	    labelRadius: null,
	    strokeWidth: 2,
	    stroke: '#000',
	    fill: 'none',
	    opacity: 0.3
	};
    },
    
    render() {
	var {width,
	     height,
	     innerWidth,
	     innerHeight,
	     margin,
	     data,
	     colorScale,
	     innerRadius,
	     outerRadius,
	     labelRadius,
	     strokeWidth,
	     stroke,
	     fill,
	     opacity} = this.props;
	
	var pie = d3.layout.pie().value(e => { return e.y; });

	var radius = Math.min(innerWidth, innerHeight) / 2;
	if (!innerRadius) {
	    innerRadius = radius * 0.8;
	}
	
	if (!outerRadius) {
	    outerRadius = radius * 0.4;
	}

	if (!labelRadius) {
	    labelRadius = radius * 0.9;
	}
	
	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);

	var outerArc = d3.svg.arc()
		.innerRadius(labelRadius)
		.outerRadius(labelRadius);

	var pieData = pie(data.values);

	var translation = "translate(" + innerWidth/2 + ", " + innerHeight/2 + ")";
	return (
		<Chart height={height} width={width} margin={margin}>
		<g transform={translation}>
		<DataSet width={innerWidth} height={innerHeight} colorScale={colorScale} pie={pieData} arc={arc} outerArc={outerArc} radius={radius} strokeWidth={strokeWidth} stroke={stroke} fill={fill} opacity={opacity}/>
		</g>
		</Chart>
	);
    }
});

module.exports = PieChart;
