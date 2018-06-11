import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const { func, oneOf, bool, objectOf, number } = PropTypes;

const TooltipMixin = {
    propTypes: {
        tooltipHtml: func,
        tooltipMode: oneOf(['mouse', 'element', 'fixed']),
        tooltipContained: bool,
        tooltipOffset: objectOf(number)
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
            tooltipOffset: { top: -35, left: 0 },
            tooltipHtml: null,
            tooltipContained: false
        };
    },

    componentDidMount() {
        this._svgNode = ReactDOM.findDOMNode(this).getElementsByTagName(
            'svg'
        )[0];
    },

    onMouseEnter(e, data) {
        if (!this.props.tooltipHtml) {
            return;
        }

        e.preventDefault();

        const {
            margin,
            tooltipMode,
            tooltipOffset,
            tooltipContained
        } = this.props;

        const svg = this._svgNode;
        let position;
        if (svg.createSVGPoint) {
            let point = svg.createSVGPoint();
            point.x = e.clientX, point.y = e.clientY;
            point = point.matrixTransform(svg.getScreenCTM().inverse());
            position = [point.x - margin.left, point.y - margin.top];
        } else {
            const rect = svg.getBoundingClientRect();
            position = [
                e.clientX - rect.left - svg.clientLeft - margin.left,
                e.clientY - rect.top - svg.clientTop - margin.top
            ];
        }

        const [html, xPos, yPos] = this._tooltipHtml(data, position);

        const svgTop = svg.getBoundingClientRect().top + margin.top;
        const svgLeft = svg.getBoundingClientRect().left + margin.left;

        let top = 0;
        let left = 0;

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

        let translate = 50;

        if (tooltipContained) {
            const t = position[0] / svg.getBoundingClientRect().width;
            translate = lerp(t, 0, 100);
        }

        this.setState({
            tooltip: {
                top,
                left,
                hidden: false,
                html,
                translate
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

export default TooltipMixin;
