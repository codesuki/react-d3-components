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
	colorScale: React.PropTypes.func.isRequired
    },
    
    render() {
	var {pie, arc, colorScale} = this.props;
	
	var wedges = pie.map(e => {
	    var wedgeArc = arc.startAngle(e.startAngle)
		    .endAngle(e.endAngle)
		    .padAngle(e.padAngle);
	    
	    var centroid = wedgeArc.centroid();
	    
	    var d = wedgeArc();
	    
	    return (
		    <g>
		    <Wedge fill={colorScale(e.data.x)} d={d}/>
		    <text x={centroid[0]} y={centroid[1]} textAnchor="middle">{e.data.x}</text>
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
	outerRadius: React.PropTypes.number
    },
    
    getDefaultProps() {
	return {
	    innerRadius: null,
	    outerRadius: null
	};
    },
    
    render() {
	var {width, height, innerWidth, innerHeight, margin, data, colorScale, innerRadius, outerRadius}
		= this.props;
	
	var pie = d3.layout.pie().value(e => { return e.y; });

	var radius = Math.min(innerWidth, innerHeight) / 2;
	if (!innerRadius) {
	    innerRadius = radius * 0.8;
	}
	
	if (!outerRadius) {
	    outerRadius = radius * 0.4;
	}
	
	var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

	var pieData = pie(data.values);

	var translation = "translate(" + innerWidth/2 + ", " + innerHeight/2 + ")";
	
	return (
		<Chart height={height} width={width} margin={margin}>
		<g transform={translation}>
		<DataSet width={innerWidth} height={innerHeight} colorScale={colorScale} pie={pieData} arc={arc}/>
		</g>
		</Chart>
	);
    }
});

module.exports = PieChart;
