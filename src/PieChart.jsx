let React = require('react');
let d3 = require('d3');

let Chart = require('./Chart');
let Tooltip = require('./Tooltip');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let AccessorMixin = require('./AccessorMixin');
let TooltipMixin = require('./TooltipMixin');

let Wedge = React.createClass({
    propTypes: {
        d: React.PropTypes.string.isRequired,
        fill: React.PropTypes.string.isRequired
    },

    render() {
        let {fill, d, data, onMouseEnter, onMouseLeave} = this.props;

        return (
            <path
                fill={fill}
                d={d}
                onMouseMove={evt => onMouseEnter(evt, data)}
                onMouseLeave={evt => onMouseLeave(evt)}
            />
        );
    }
});

let DataSet = React.createClass({
    propTypes: {
        pie: React.PropTypes.array.isRequired,
        arc: React.PropTypes.func.isRequired,
        outerArc: React.PropTypes.func.isRequired,
        colorScale: React.PropTypes.func.isRequired,
        radius: React.PropTypes.number.isRequired,
        strokeWidth: React.PropTypes.number,
        stroke: React.PropTypes.string,
        fill: React.PropTypes.string,
        opacity: React.PropTypes.number,
        x: React.PropTypes.func.isRequired,
        hideLabels: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            strokeWidth: 2,
            stroke: '#000',
            fill: 'none',
            opacity: 0.3,
            hideLabels: false
        };
    },

    renderLabel(wedge) {
        let {
            arc,
            outerArc,
            radius,
            strokeWidth,
            stroke,
            fill,
            opacity,
            x
        } = this.props;

        let labelPos = outerArc.centroid(wedge);
        labelPos[0] = radius * (this.midAngle(wedge) < Math.PI ? 1 : -1);

        let linePos = outerArc.centroid(wedge);
        linePos[0] = radius * 0.95 * (this.midAngle(wedge) < Math.PI ? 1 : -1);

        const textAnchor = this.midAngle(wedge) < Math.PI ? 'start' : 'end';

        return (
            <g>
                <polyline
                    opacity={opacity}
                    strokeWidth={strokeWidth}
                    stroke={stroke}
                    fill={fill}
                    points={[arc.centroid(wedge), outerArc.centroid(wedge), linePos]}
                />
                <text
                    dy=".35em"
                    x={labelPos[0]}
                    y={labelPos[1]}
                    textAnchor={textAnchor}>{x(wedge.data)}
                </text>
            </g>
        );
    },

    render() {
        let {pie,
             arc,
             colorScale,
             x,
             y,
             onMouseEnter,
             onMouseLeave,
             hideLabels} = this.props;

        let wedges = pie.map((e, index) =>
            <g key={`${x(e.data)}.${y(e.data)}.${index}`} className="arc">
                <Wedge
                    data={e.data}
                    fill={colorScale(x(e.data))}
                    d={arc(e)}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                />
                {!hideLabels && !!e.value && this.renderLabel(e)}
            </g>
        );

        return (
            <g>
                {wedges}
            </g>
        );
    },

    midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
});

let PieChart = React.createClass({
    mixins: [DefaultPropsMixin,
             HeightWidthMixin,
             AccessorMixin,
             TooltipMixin],

    propTypes: {
        innerRadius: React.PropTypes.number,
        outerRadius: React.PropTypes.number,
        labelRadius: React.PropTypes.number,
        padRadius: React.PropTypes.string,
        cornerRadius: React.PropTypes.number,
        sort: React.PropTypes.any,
        hideLabels: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            innerRadius: null,
            outerRadius: null,
            labelRadius: null,
            padRadius: 'auto',
            cornerRadius: 0,
            sort: undefined,
            hideLabels: false
        };
    },

    _tooltipHtml(d) {
        let html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

        return [html, 0, 0];
    },

    render() {
        let {data,
             width,
             height,
             margin,
             colorScale,
             innerRadius,
             outerRadius,
             labelRadius,
             padRadius,
             cornerRadius,
             sort,
             x,
             y,
             values,
             hideLabels} = this.props;

        let [innerWidth,
             innerHeight] = [this._innerWidth,
                             this._innerHeight];

        let pie = d3.layout.pie()
                .value(e => y(e));

        if (typeof sort !== 'undefined') {
            pie = pie.sort(sort);
        }

        let radius = Math.min(innerWidth, innerHeight) / 2;
        if (!innerRadius) {
            innerRadius = radius * 0.8;
        }

        if (!outerRadius) {
            outerRadius = radius * 0.4;
        }

        if (!labelRadius) {
            labelRadius = radius * 0.9;
        }

        let arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .padRadius(padRadius)
                .cornerRadius(cornerRadius);

        let outerArc = d3.svg.arc()
                .innerRadius(labelRadius)
                .outerRadius(labelRadius);

        let pieData = pie(values(data));

        let translation = `translate(${innerWidth/2}, ${innerHeight/2})`;
        return (
            <div>
                <Chart height={height} width={width} margin={margin}>
                    <g transform={translation}>
                        <DataSet
                            width={innerWidth}
                            height={innerHeight}
                            colorScale={colorScale}
                            pie={pieData}
                            arc={arc}
                            outerArc={outerArc}
                            radius={radius}
                            x={x}
                            y={y}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                            hideLabels={hideLabels}
                        />
                    </g>
                    { this.props.children }
                </Chart>
                <Tooltip {...this.state.tooltip} />
            </div>
        );
    }
});

module.exports = PieChart;
