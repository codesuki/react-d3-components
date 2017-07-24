'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _Chart = require('./Chart');

var _Chart2 = _interopRequireDefault(_Chart);

var _Tooltip = require('./Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _DefaultPropsMixin = require('./DefaultPropsMixin');

var _DefaultPropsMixin2 = _interopRequireDefault(_DefaultPropsMixin);

var _HeightWidthMixin = require('./HeightWidthMixin');

var _HeightWidthMixin2 = _interopRequireDefault(_HeightWidthMixin);

var _AccessorMixin = require('./AccessorMixin');

var _AccessorMixin2 = _interopRequireDefault(_AccessorMixin);

var _TooltipMixin = require('./TooltipMixin');

var _TooltipMixin2 = _interopRequireDefault(_TooltipMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var string = _react.PropTypes.string,
    array = _react.PropTypes.array,
    number = _react.PropTypes.number,
    bool = _react.PropTypes.bool,
    func = _react.PropTypes.func,
    any = _react.PropTypes.any;


var Wedge = _react2.default.createClass({
    displayName: 'Wedge',

    propTypes: {
        d: string.isRequired,
        fill: string.isRequired
    },

    render: function render() {
        var _props = this.props,
            fill = _props.fill,
            d = _props.d,
            data = _props.data,
            onMouseEnter = _props.onMouseEnter,
            _onMouseLeave = _props.onMouseLeave,
            onMouseClick = _props.onMouseClick;


        return _react2.default.createElement('path', {
            fill: fill,
            d: d,
            onMouseMove: function onMouseMove(evt) {
                return onMouseEnter(evt, data);
            },
            onMouseLeave: function onMouseLeave(evt) {
                return _onMouseLeave(evt);
            },
            onClick: function onClick(evt) {
                return onMouseClick(evt, data);
            }
        });
    }
});

var DataSet = _react2.default.createClass({
    displayName: 'DataSet',

    propTypes: {
        pie: array.isRequired,
        arc: func.isRequired,
        outerArc: func.isRequired,
        colorScale: func.isRequired,
        radius: number.isRequired,
        strokeWidth: number,
        stroke: string,
        fill: string,
        opacity: number,
        x: func.isRequired,
        hideLabels: bool
    },

    getDefaultProps: function getDefaultProps() {
        return {
            strokeWidth: 2,
            stroke: '#000',
            fill: 'none',
            opacity: 0.3,
            hideLabels: false
        };
    },
    renderLabel: function renderLabel(wedge) {
        var _props2 = this.props,
            arc = _props2.arc,
            outerArc = _props2.outerArc,
            radius = _props2.radius,
            strokeWidth = _props2.strokeWidth,
            stroke = _props2.stroke,
            fill = _props2.fill,
            opacity = _props2.opacity,
            x = _props2.x;


        var labelPos = outerArc.centroid(wedge);
        labelPos[0] = radius * (this.midAngle(wedge) < Math.PI ? 1 : -1);

        var linePos = outerArc.centroid(wedge);
        linePos[0] = radius * 0.95 * (this.midAngle(wedge) < Math.PI ? 1 : -1);

        var textAnchor = this.midAngle(wedge) < Math.PI ? 'start' : 'end';

        return _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('polyline', {
                opacity: opacity,
                strokeWidth: strokeWidth,
                stroke: stroke,
                fill: fill,
                points: [arc.centroid(wedge), outerArc.centroid(wedge), linePos]
            }),
            _react2.default.createElement(
                'text',
                {
                    dy: '.35em',
                    x: labelPos[0],
                    y: labelPos[1],
                    textAnchor: textAnchor },
                x(wedge.data)
            )
        );
    },
    render: function render() {
        var _this = this;

        var _props3 = this.props,
            pie = _props3.pie,
            arc = _props3.arc,
            colorScale = _props3.colorScale,
            x = _props3.x,
            y = _props3.y,
            onMouseEnter = _props3.onMouseEnter,
            onMouseLeave = _props3.onMouseLeave,
            onMouseClick = _props3.onMouseClick,
            hideLabels = _props3.hideLabels;


        var wedges = pie.map(function (e, index) {
            return _react2.default.createElement(
                'g',
                { key: x(e.data) + '.' + y(e.data) + '.' + index, className: 'arc' },
                _react2.default.createElement(Wedge, {
                    data: e.data,
                    fill: colorScale(x(e.data)),
                    d: arc(e),
                    onMouseEnter: onMouseEnter,
                    onMouseLeave: onMouseLeave,
                    onMouseClick: onMouseClick
                }),
                !hideLabels && !!e.value && _this.renderLabel(e)
            );
        });

        return _react2.default.createElement(
            'g',
            null,
            wedges
        );
    },
    midAngle: function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
});

var PieChart = _react2.default.createClass({
    displayName: 'PieChart',

    mixins: [_DefaultPropsMixin2.default, _HeightWidthMixin2.default, _AccessorMixin2.default, _TooltipMixin2.default],

    propTypes: {
        innerRadius: number,
        outerRadius: number,
        labelRadius: number,
        padRadius: string,
        cornerRadius: number,
        sort: any,
        hideLabels: bool
    },

    getDefaultProps: function getDefaultProps() {
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
    _tooltipHtml: function _tooltipHtml(d) {
        var html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

        return [html, 0, 0];
    },
    render: function render() {
        var _props4 = this.props,
            data = _props4.data,
            width = _props4.width,
            height = _props4.height,
            margin = _props4.margin,
            colorScale = _props4.colorScale,
            padRadius = _props4.padRadius,
            cornerRadius = _props4.cornerRadius,
            sort = _props4.sort,
            x = _props4.x,
            y = _props4.y,
            values = _props4.values,
            hideLabels = _props4.hideLabels,
            onMouseClick = _props4.onMouseClick;
        var _props5 = this.props,
            innerRadius = _props5.innerRadius,
            outerRadius = _props5.outerRadius,
            labelRadius = _props5.labelRadius;


        var innerWidth = this._innerWidth;
        var innerHeight = this._innerHeight;

        var pie = _d2.default.layout.pie().value(function (e) {
            return y(e);
        });

        if (typeof sort !== 'undefined') {
            pie = pie.sort(sort);
        }

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

        var arc = _d2.default.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius).padRadius(padRadius).cornerRadius(cornerRadius);

        var outerArc = _d2.default.svg.arc().innerRadius(labelRadius).outerRadius(labelRadius);

        var pieData = pie(values(data));

        var translation = 'translate(' + innerWidth / 2 + ', ' + innerHeight / 2 + ')';

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                _Chart2.default,
                { height: height, width: width, margin: margin },
                _react2.default.createElement(
                    'g',
                    { transform: translation },
                    _react2.default.createElement(DataSet, {
                        width: innerWidth,
                        height: innerHeight,
                        colorScale: colorScale,
                        pie: pieData,
                        arc: arc,
                        outerArc: outerArc,
                        radius: radius,
                        x: x,
                        y: y,
                        onMouseEnter: this.onMouseEnter,
                        onMouseLeave: this.onMouseLeave,
                        onMouseClick: onMouseClick,
                        hideLabels: hideLabels
                    })
                ),
                this.props.children
            ),
            _react2.default.createElement(_Tooltip2.default, this.state.tooltip)
        );
    }
});

exports.default = PieChart;