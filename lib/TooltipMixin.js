'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var func = _react.PropTypes.func,
    oneOf = _react.PropTypes.oneOf,
    bool = _react.PropTypes.bool,
    objectOf = _react.PropTypes.objectOf,
    number = _react.PropTypes.number;


var TooltipMixin = {
    propTypes: {
        tooltipHtml: func,
        tooltipMode: oneOf(['mouse', 'element', 'fixed']),
        tooltipContained: bool,
        tooltipOffset: objectOf(number)
    },

    getInitialState: function getInitialState() {
        return {
            tooltip: {
                hidden: true
            }
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            tooltipMode: 'mouse',
            tooltipOffset: { top: -35, left: 0 },
            tooltipHtml: null,
            tooltipContained: false
        };
    },
    componentDidMount: function componentDidMount() {
        this._svgNode = _reactDom2.default.findDOMNode(this).getElementsByTagName('svg')[0];
    },
    onMouseEnter: function onMouseEnter(e, data) {
        if (!this.props.tooltipHtml) {
            return;
        }

        e.preventDefault();

        var _props = this.props,
            margin = _props.margin,
            tooltipMode = _props.tooltipMode,
            tooltipOffset = _props.tooltipOffset,
            tooltipContained = _props.tooltipContained;


        var svg = this._svgNode;
        var position = void 0;
        if (svg.createSVGPoint) {
            var point = svg.createSVGPoint();
            point.x = e.clientX, point.y = e.clientY;
            point = point.matrixTransform(svg.getScreenCTM().inverse());
            position = [point.x - margin.left, point.y - margin.top];
        } else {
            var rect = svg.getBoundingClientRect();
            position = [e.clientX - rect.left - svg.clientLeft - margin.left, e.clientY - rect.top - svg.clientTop - margin.top];
        }

        var _tooltipHtml = this._tooltipHtml(data, position),
            _tooltipHtml2 = _slicedToArray(_tooltipHtml, 3),
            html = _tooltipHtml2[0],
            xPos = _tooltipHtml2[1],
            yPos = _tooltipHtml2[2];

        var svgTop = svg.getBoundingClientRect().top + margin.top;
        var svgLeft = svg.getBoundingClientRect().left + margin.left;

        var top = 0;
        var left = 0;

        if (tooltipMode === 'fixed') {
            top = svgTop + tooltipOffset.top;
            left = svgLeft + tooltipOffset.left;
        } else if (tooltipMode === 'element') {
            top = svgTop + yPos + tooltipOffset.top;
            left = svgLeft + xPos + tooltipOffset.left;
        } else {
            // mouse
            top = e.clientY + tooltipOffset.top;
            left = e.clientX + tooltipOffset.left;
        }

        function lerp(t, a, b) {
            return (1 - t) * a + t * b;
        }

        var translate = 50;

        if (tooltipContained) {
            var t = position[0] / svg.getBoundingClientRect().width;
            translate = lerp(t, 0, 100);
        }

        this.setState({
            tooltip: {
                top: top,
                left: left,
                hidden: false,
                html: html,
                translate: translate
            }
        });
    },
    onMouseLeave: function onMouseLeave(e) {
        if (!this.props.tooltipHtml) {
            return;
        }

        e.preventDefault();

        this.setState({
            tooltip: {
                hidden: true
            }
        });
    }
};

exports.default = TooltipMixin;