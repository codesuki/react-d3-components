let React = require('react');
let d3 = require('d3');

let TooltipMixin = {
    propTypes: {
        tooltipHtml: React.PropTypes.func,
        tooltipMode: React.PropTypes.oneOf(['mouse', 'element', 'fixed']),
        tooltipContained: React.PropTypes.bool,
        tooltipOffset: React.PropTypes.objectOf(React.PropTypes.number)
    },

    getInitialState() {
        return {
            tooltip: {
                hidden: true
            }
        };
    },

    getDefaultProps() {
        return {
            tooltipMode: 'mouse',
            tooltipOffset: {top: -35, left: 0},
            tooltipHtml: null,
            tooltipContained: false
        };
    },

    componentDidMount() {
        this._svg_node = this.getDOMNode().getElementsByTagName("svg")[0];
    },

    onMouseEnter(e, data) {
        if (!this.props.tooltipHtml) {
            return;
        }

        e.preventDefault();

        let {margin,
             tooltipMode,
             tooltipOffset,
             tooltipContained} = this.props;

        let svg = this._svg_node;
        let position;
        if (svg.createSVGPoint) {
            var point = svg.createSVGPoint();
            point.x = e.clientX, point.y = e.clientY;
            point = point.matrixTransform(svg.getScreenCTM().inverse());
            position = [point.x - margin.left, point.y - margin.top];
        } else {
            let rect = svg.getBoundingClientRect();
            position = [e.clientX - rect.left - svg.clientLeft - margin.left,
                        e.clientY - rect.top - svg.clientTop - margin.top];
        }

        let [html, xPos, yPos] = this._tooltipHtml(data, position);

        let svgTop = svg.getBoundingClientRect().top + margin.top;
        let svgLeft = svg.getBoundingClientRect().left + margin.left;

        let top = 0;
        let left = 0;

        if (tooltipMode === 'fixed') {
            top = svgTop + tooltipOffset.top;
            left = svgLeft + tooltipOffset.left;
        } else if (tooltipMode === 'element') {
            top = svgTop + yPos + tooltipOffset.top;
            left = svgLeft + xPos + tooltipOffset.left;
        } else { // mouse
            top = e.clientY + tooltipOffset.top;
            left = e.clientX + tooltipOffset.left;
        }

        function lerp(t, a, b) {
            return (1 - t) * a + t * b;
        }

        let translate = 50;

        if (tooltipContained) {
            let t = position[0] / svg.getBoundingClientRect().width;
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

    onMouseLeave(e) {
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

module.exports = TooltipMixin;
