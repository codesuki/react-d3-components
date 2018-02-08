'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var array = _react.PropTypes.array,
    func = _react.PropTypes.func,
    oneOf = _react.PropTypes.oneOf,
    number = _react.PropTypes.number,
    string = _react.PropTypes.string;


var Axis = _react2.default.createClass({
    displayName: 'Axis',

    propTypes: {
        tickArguments: array,
        tickValues: array,
        tickFormat: func,
        tickDirection: oneOf(['horizontal', 'vertical', 'diagonal']),
        innerTickSize: number,
        tickPadding: number,
        outerTickSize: number,
        scale: func.isRequired,
        className: string,
        zero: number,
        orientation: oneOf(['top', 'bottom', 'left', 'right']).isRequired,
        label: string
    },

    getDefaultProps: function getDefaultProps() {
        return {
            tickArguments: [10],
            tickValues: null,
            tickFormat: null,
            tickDirection: 'horizontal',
            innerTickSize: 6,
            tickPadding: 3,
            outerTickSize: 6,
            className: 'axis',
            zero: 0,
            label: ''
        };
    },
    _getTranslateString: function _getTranslateString() {
        var _props = this.props,
            orientation = _props.orientation,
            height = _props.height,
            width = _props.width,
            zero = _props.zero;


        if (orientation === 'top') {
            return 'translate(0, ' + zero + ')';
        } else if (orientation === 'bottom') {
            return 'translate(0, ' + (zero == 0 ? height : zero) + ')';
        } else if (orientation === 'left') {
            return 'translate(' + zero + ', 0)';
        } else if (orientation === 'right') {
            return 'translate(' + (zero == 0 ? width : zero) + ', 0)';
        } else {
            return '';
        }
    },
    render: function render() {
        var _props2 = this.props,
            height = _props2.height,
            tickArguments = _props2.tickArguments,
            tickValues = _props2.tickValues,
            tickDirection = _props2.tickDirection,
            innerTickSize = _props2.innerTickSize,
            tickPadding = _props2.tickPadding,
            outerTickSize = _props2.outerTickSize,
            scale = _props2.scale,
            orientation = _props2.orientation,
            zero = _props2.zero;
        var _props3 = this.props,
            width = _props3.width,
            className = _props3.className,
            label = _props3.label;
        var tickFormat = this.props.tickFormat;


        var ticks = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues;

        if (!tickFormat) {
            if (scale.tickFormat) {
                tickFormat = scale.tickFormat.apply(scale, tickArguments);
            } else {
                tickFormat = function tickFormat(x) {
                    return x;
                };
            }
        }

        // TODO: is there a cleaner way? removes the 0 tick if axes are crossing
        if (zero != height && zero != width && zero != 0) {
            ticks = ticks.filter(function (element) {
                return element != 0;
            });
        }

        var tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

        var sign = orientation === 'top' || orientation === 'left' ? -1 : 1;

        var range = this._d3ScaleRange(scale);

        var activeScale = scale.rangeBand ? function (e) {
            return scale(e) + scale.rangeBand() / 2;
        } : scale;

        var transform = void 0,
            x = void 0,
            y = void 0,
            x2 = void 0,
            y2 = void 0,
            dy = void 0,
            textAnchor = void 0,
            d = void 0,
            labelElement = void 0,
            tickRotation = 0;
        if (orientation === 'bottom' || orientation === 'top') {
            transform = 'translate({}, 0)';
            x = 0;
            y = sign * tickSpacing;
            x2 = 0;
            y2 = sign * innerTickSize;
            dy = sign < 0 ? '0em' : '.71em';
            textAnchor = 'middle';
            d = 'M' + range[0] + ', ' + sign * outerTickSize + 'V0H' + range[1] + 'V' + sign * outerTickSize;
            if (tickDirection === 'vertical') {
                tickRotation = -90;
                x = -tickSpacing;
                y = -innerTickSize;
                textAnchor = 'end';
            } else if (tickDirection === 'diagonal') {
                tickRotation = -45;
                x = -tickSpacing;
                y = 0;
                textAnchor = 'end';
            }

            labelElement = _react2.default.createElement(
                'text',
                { className: className + ' label', textAnchor: "end", x: width, y: -6 },
                label
            );
        } else {
            transform = 'translate(0, {})';
            x = sign * tickSpacing;
            y = 0;
            x2 = sign * innerTickSize;
            y2 = 0;
            dy = '.32em';
            textAnchor = sign < 0 ? 'end' : 'start';
            d = 'M' + sign * outerTickSize + ', ' + range[0] + 'H0V' + range[1] + 'H' + sign * outerTickSize;
            if (tickDirection === 'vertical') {
                tickRotation = -90;
                x -= sign * tickSpacing;
                y = -(tickSpacing + innerTickSize);
                textAnchor = 'middle';
            } else if (tickDirection === 'diagonal') {
                tickRotation = -45;
                x -= sign * tickSpacing;
                y = -(tickSpacing + innerTickSize);
                textAnchor = 'middle';
            }

            labelElement = _react2.default.createElement(
                'text',
                { className: className + ' label', textAnchor: 'end', y: 6, dy: orientation === 'left' ? '.75em' : '-1.25em', transform: 'rotate(-90)' },
                label
            );
        }

        var tickElements = ticks.map(function (tick, index) {
            var position = activeScale(tick);
            var translate = transform.replace('{}', position);
            return _react2.default.createElement(
                'g',
                { key: tick + '.' + index, className: 'tick', transform: translate },
                _react2.default.createElement('line', { x2: x2, y2: y2, stroke: '#aaa' }),
                _react2.default.createElement(
                    'text',
                    { x: x, y: y, dy: dy, textAnchor: textAnchor, transform: 'rotate(' + tickRotation + ')' },
                    tickFormat(tick)
                )
            );
        });

        var pathElement = _react2.default.createElement('path', { className: 'domain', d: d, fill: 'none', stroke: '#aaa' });

        var axisBackground = _react2.default.createElement('rect', { className: 'axis-background', fill: 'none' });

        return _react2.default.createElement(
            'g',
            { ref: 'axis', className: className, transform: this._getTranslateString(), style: { shapeRendering: 'crispEdges' } },
            axisBackground,
            tickElements,
            pathElement,
            labelElement
        );
    },
    _d3ScaleExtent: function _d3ScaleExtent(domain) {
        var start = domain[0];
        var stop = domain[domain.length - 1];
        return start < stop ? [start, stop] : [stop, start];
    },
    _d3ScaleRange: function _d3ScaleRange(scale) {
        return scale.rangeExtent ? scale.rangeExtent() : this._d3ScaleExtent(scale.range());
    }
});

exports.default = Axis;