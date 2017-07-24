'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Chart = require('./Chart');

var _Chart2 = _interopRequireDefault(_Chart);

var _Axis = require('./Axis');

var _Axis2 = _interopRequireDefault(_Axis);

var _HeightWidthMixin = require('./HeightWidthMixin');

var _HeightWidthMixin2 = _interopRequireDefault(_HeightWidthMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Adapted for React from https://github.com/mbostock/d3/blob/master/src/svg/brush.js
// TODO: Add D3 License
var _d3SvgBrushCursor = {
    n: 'ns-resize',
    e: 'ew-resize',
    s: 'ns-resize',
    w: 'ew-resize',
    nw: 'nwse-resize',
    ne: 'nesw-resize',
    se: 'nwse-resize',
    sw: 'nesw-resize'
};

var _d3SvgBrushResizes = [['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'], ['e', 'w'], ['n', 's'], []];

// TODO: add y axis support
var Brush = _react2.default.createClass({
    displayName: 'Brush',

    mixins: [_HeightWidthMixin2.default],

    getInitialState: function getInitialState() {
        return {
            resizers: _d3SvgBrushResizes[0],
            xExtent: [0, 0],
            yExtent: [0, 0],
            xExtentDomain: undefined,
            yExtentDomain: undefined
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            xScale: null,
            yScale: null
        };
    },
    componentWillMount: function componentWillMount() {
        this._extent(this.props.extent);

        this.setState({
            resizers: _d3SvgBrushResizes[!this.props.xScale << 1 | !this.props.yScale]
        });
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // when <Brush/> is used inside a component
        // we should not set the extent prop on every redraw of the parent, because it will
        // stop us from actually setting the extent with the brush.
        if (nextProps.xScale !== this.props.xScale) {
            this._extent(nextProps.extent, nextProps.xScale);
            this.setState({
                resizers: _d3SvgBrushResizes[!this.props.xScale << 1 | !this.props.yScale]
            });
        }
    },
    render: function render() {
        var _this = this;

        // TODO: remove this.state this.props
        var xRange = this.props.xScale ? this._d3ScaleRange(this.props.xScale) : null;
        var yRange = this.props.yScale ? this._d3ScaleRange(this.props.yScale) : null;

        var background = _react2.default.createElement('rect', {
            className: 'background',
            style: { visibility: 'visible', cursor: 'crosshair' },
            x: xRange ? xRange[0] : '',
            width: xRange ? xRange[1] - xRange[0] : '',
            y: yRange ? yRange[0] : '',
            height: yRange ? yRange[1] - yRange[0] : this._innerHeight,
            onMouseDown: this._onMouseDownBackground
        });

        // TODO: it seems like actually we can have both x and y scales at the same time. need to find example.

        var extent = void 0;
        if (this.props.xScale) {
            extent = _react2.default.createElement('rect', {
                className: 'extent',
                style: { cursor: 'move' },
                x: this.state.xExtent[0],
                width: this.state.xExtent[1] - this.state.xExtent[0],
                height: this._innerHeight,
                onMouseDown: this._onMouseDownExtent
            });
        }

        var resizers = this.state.resizers.map(function (e) {
            return _react2.default.createElement(
                'g',
                {
                    key: e,
                    className: 'resize ' + e,
                    style: { cursor: _d3SvgBrushCursor[e] },
                    transform: 'translate(' + _this.state.xExtent[+/e$/.test(e)] + ', ' + _this.state.yExtent[+/^s/.test(e)] + ')',
                    onMouseDown: function onMouseDown(event) {
                        _this._onMouseDownResizer(event, e);
                    }
                },
                _react2.default.createElement('rect', {
                    x: /[ew]$/.test(e) ? -3 : null,
                    y: /^[ns]/.test(e) ? -3 : null,
                    width: '6',
                    height: _this._innerHeight,
                    style: { visibility: 'hidden', display: _this._empty() ? 'none' : null }
                })
            );
        });

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                _Chart2.default,
                { height: this.props.height, width: this.props.width, margin: this.props.margin },
                _react2.default.createElement(
                    'g',
                    {
                        style: { pointerEvents: 'all' },
                        onMouseUp: this._onMouseUp,
                        onMouseMove: this._onMouseMove
                    },
                    background,
                    extent,
                    resizers
                ),
                _react2.default.createElement(_Axis2.default, _extends({
                    className: 'x axis',
                    orientation: 'bottom',
                    scale: this.props.xScale,
                    height: this._innerHeight,
                    width: this._innerWidth
                }, this.props.xAxis)),
                this.props.children
            )
        );
    },


    // TODO: Code duplicated in TooltipMixin.jsx, move outside.
    _getMousePosition: function _getMousePosition(e) {
        var svg = _reactDom2.default.findDOMNode(this).getElementsByTagName('svg')[0];
        var position = void 0;
        if (svg.createSVGPoint) {
            var point = svg.createSVGPoint();
            point.x = e.clientX;
            point.y = e.clientY;
            point = point.matrixTransform(svg.getScreenCTM().inverse());
            position = [point.x - this.props.margin.left, point.y - this.props.margin.top];
        } else {
            var rect = svg.getBoundingClientRect();
            position = [e.clientX - rect.left - svg.clientLeft - this.props.margin.left, e.clientY - rect.top - svg.clientTop - this.props.margin.left];
        }

        return position;
    },
    _onMouseDownBackground: function _onMouseDownBackground(e) {
        e.preventDefault();
        var range = this._d3ScaleRange(this.props.xScale);
        var point = this._getMousePosition(e);

        var size = this.state.xExtent[1] - this.state.xExtent[0];

        range[1] -= size;

        var min = Math.max(range[0], Math.min(range[1], point[0]));
        this.setState({ xExtent: [min, min + size] });
    },


    // TODO: use constants instead of strings
    _onMouseDownExtent: function _onMouseDownExtent(e) {
        e.preventDefault();
        this._mouseMode = 'drag';

        var point = this._getMousePosition(e);
        var distanceFromBorder = point[0] - this.state.xExtent[0];

        this._startPosition = distanceFromBorder;
    },
    _onMouseDownResizer: function _onMouseDownResizer(e, dir) {
        e.preventDefault();
        this._mouseMode = 'resize';
        this._resizeDir = dir;
    },
    _onDrag: function _onDrag(e) {
        var range = this._d3ScaleRange(this.props.xScale);
        var point = this._getMousePosition(e);

        var size = this.state.xExtent[1] - this.state.xExtent[0];

        range[1] -= size;

        var min = Math.max(range[0], Math.min(range[1], point[0] - this._startPosition));

        this.setState({ xExtent: [min, min + size], xExtentDomain: null });
    },
    _onResize: function _onResize(e) {
        var range = this._d3ScaleRange(this.props.xScale);
        var point = this._getMousePosition(e);
        // Don't let the extent go outside of its limits
        // TODO: support clamp argument of D3
        var min = Math.max(range[0], Math.min(range[1], point[0]));

        if (this._resizeDir == 'w') {
            if (min > this.state.xExtent[1]) {
                this.setState({ xExtent: [this.state.xExtent[1], min], xExtentDomain: null });
                this._resizeDir = 'e';
            } else {
                this.setState({ xExtent: [min, this.state.xExtent[1]], xExtentDomain: null });
            }
        } else if (this._resizeDir == 'e') {
            if (min < this.state.xExtent[0]) {
                this.setState({ xExtent: [min, this.state.xExtent[0]], xExtentDomain: null });
                this._resizeDir = 'w';
            } else {
                this.setState({ xExtent: [this.state.xExtent[0], min], xExtentDomain: null });
            }
        }
    },
    _onMouseMove: function _onMouseMove(e) {
        e.preventDefault();

        if (this._mouseMode == 'resize') {
            this._onResize(e);
        } else if (this._mouseMode == 'drag') {
            this._onDrag(e);
        }
    },
    _onMouseUp: function _onMouseUp(e) {
        e.preventDefault();

        this._mouseMode = null;

        this.props.onChange(this._extent());
    },
    _extent: function _extent(z, xScale) {
        var x = xScale || this.props.xScale;
        var y = this.props.yScale;

        var _state = this.state,
            xExtent = _state.xExtent,
            yExtent = _state.yExtent,
            xExtentDomain = _state.xExtentDomain,
            yExtentDomain = _state.yExtentDomain;


        var x0 = void 0,
            x1 = void 0,
            y0 = void 0,
            y1 = void 0,
            t = void 0;

        // Invert the pixel extent to data-space.
        if (!arguments.length) {
            if (x) {
                if (xExtentDomain) {
                    x0 = xExtentDomain[0], x1 = xExtentDomain[1];
                } else {
                    x0 = xExtent[0], x1 = xExtent[1];
                    if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);
                    if (x1 < x0) t = x0, x0 = x1, x1 = t;
                }
            }
            if (y) {
                if (yExtentDomain) {
                    y0 = yExtentDomain[0], y1 = yExtentDomain[1];
                } else {
                    y0 = yExtent[0], y1 = yExtent[1];
                    if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);
                    if (y1 < y0) t = y0, y0 = y1, y1 = t;
                }
            }
            return x && y ? [[x0, y0], [x1, y1]] : x ? [x0, x1] : y && [y0, y1];
        }

        // Scale the data-space extent to pixels.
        if (x) {
            x0 = z[0], x1 = z[1];
            if (y) x0 = x0[0], x1 = x1[0];
            xExtentDomain = [x0, x1];
            if (x.invert) x0 = x(x0), x1 = x(x1);
            if (x1 < x0) t = x0, x0 = x1, x1 = t;
            if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [x0, x1]; // copy-on-write
        }
        if (y) {
            y0 = z[0], y1 = z[1];
            if (x) y0 = y0[1], y1 = y1[1];
            yExtentDomain = [y0, y1];
            if (y.invert) y0 = y(y0), y1 = y(y1);
            if (y1 < y0) t = y0, y0 = y1, y1 = t;
            if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [y0, y1]; // copy-on-write
        }

        this.setState({ xExtent: xExtent, yExtent: yExtent, xExtentDomain: xExtentDomain, yExtentDomain: yExtentDomain });
    },
    _empty: function _empty() {
        return !!this.props.xScale && this.state.xExtent[0] == this.state.xExtent[1] || !!this.props.yScale && this.state.yExtent[0] == this.state.yExtent[1];
    },


    // TODO: Code duplicated in Axis.jsx, move outside.
    _d3ScaleExtent: function _d3ScaleExtent(domain) {
        var start = domain[0];
        var stop = domain[domain.length - 1];
        return start < stop ? [start, stop] : [stop, start];
    },
    _d3ScaleRange: function _d3ScaleRange(scale) {
        return scale.rangeExtent ? scale.rangeExtent() : this._d3ScaleExtent(scale.range());
    }
});

exports.default = Brush;