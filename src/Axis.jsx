let React = require('react');
let d3 = require('d3');

let Axis = React.createClass({
    propTypes: {
        tickArguments: React.PropTypes.array,
        tickValues: React.PropTypes.array,
        tickFormat: React.PropTypes.func,
        innerTickSize: React.PropTypes.number,
        tickPadding: React.PropTypes.number,
        outerTickSize: React.PropTypes.number,
        scale: React.PropTypes.func.isRequired,
        className: React.PropTypes.string,
        zero: React.PropTypes.number,
        orientation: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
        label: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            tickArguments: [10],
            tickValues: null,
            tickFormat: null,
            innerTickSize: 6,
            tickPadding: 3,
            outerTickSize: 6,
            className: "axis",
            zero: 0,
            label: ""
        };
    },

    _getTranslateString() {
        let {orientation, height, width, zero} = this.props;

        if (orientation === "top") {
            return `translate(0, ${zero})`;
        } else if (orientation === "bottom") {
            return `translate(0, ${zero == 0 ? height : zero})`;
        } else if (orientation === "left") {
            return `translate(${zero}, 0)`;
        } else if (orientation === "right") {
            return `translate(${zero == 0 ? width : zero}, 0)`;
        } else {
            return "";
        }
    },

    render() {
        let {height,
             width,
             tickArguments,
             tickValues,
             tickFormat,
             innerTickSize,
             tickPadding,
             outerTickSize,
             scale,
             orientation,
             className,
             zero,
             label} = this.props;

        let ticks = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues;

        if (!tickFormat)
        {
            if (scale.tickFormat) {
                tickFormat = scale.tickFormat.apply(scale, tickArguments);
            } else {
                tickFormat = x => { return x; };
            }
        }

        // TODO: is there a cleaner way? removes the 0 tick if axes are crossing
        if (zero != height && zero != width && zero != 0) {
            ticks = ticks.filter((element, index, array) => { return element == 0 ? false : true;});
        }

        let tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

        let sign = orientation === "top" || orientation === "left" ? -1 : 1;

        let range = this._d3_scaleRange(scale);

        let activeScale = scale.rangeBand ? e => { return scale(e) + scale.rangeBand() / 2; } : scale;

        let transform, x, y, x2, y2, dy, textAnchor, d, labelElement;
        if (orientation === "bottom" || orientation === "top") {
            transform = `translate({}, 0)`;
            x = 0;
            y = sign * tickSpacing;
            x2 = 0;
            y2 = sign * innerTickSize;
            dy = sign < 0 ? "0em" : ".71em";
            textAnchor = "middle";
            d = `M${range[0]}, ${sign * outerTickSize}V0H${range[1]}V${sign * outerTickSize}`;

            labelElement = <text className={`${className} label`} textAnchor={"end"} x={width} y={-6}>{label}</text>;
        } else {
            transform = `translate(0, {})`;
            x = sign * tickSpacing;
            y = 0;
            x2 = sign * innerTickSize;
            y2 = 0;
            dy = ".32em";
            textAnchor = sign < 0 ? "end" : "start";
            d = `M${sign * outerTickSize}, ${range[0]}H0V${range[1]}H${sign * outerTickSize}`;

            labelElement = <text className={`${className} label`} textAnchor={"end"} y={6} dy={".75em"} transform={"rotate(-90)"}>{label}</text>;
        }

        let tickElements = ticks.map((tick, index) => {
            let position = activeScale(tick);
            let translate = transform.replace("{}", position);
            return (
                    <g key={`${tick}.${index}`} className="tick" transform={translate}>
                    <line x2={x2} y2={y2} stroke="#aaa"/>
                    <text x={x} y={y} dy={dy} textAnchor={textAnchor}>
                    {tickFormat(tick)}</text>
                    </g>
            );
        });

        let pathElement = <path className="domain" d={d} fill="none" stroke="#aaa"/>;
        
        let axisBackground = <rect className="axis-background" fill="none"/>;

        return (
            <g ref="axis" className={className} transform={this._getTranslateString()} style={{shapeRendering: 'crispEdges'}}>
                {axisBackground}
                {tickElements}
                {pathElement}
                {labelElement}
            </g>
        );
    },

    _d3_scaleExtent(domain) {
        let start = domain[0], stop = domain[domain.length - 1];
        return start < stop ? [start, stop] : [stop, start];
    },

    _d3_scaleRange(scale) {
        return scale.rangeExtent ? scale.rangeExtent() : this._d3_scaleExtent(scale.range());
    }
});

module.exports = Axis;
