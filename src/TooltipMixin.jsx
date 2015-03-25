let React = require('react');
let d3 = require('d3');

let TooltipMixin = {
	propTypes: {
		tooltipHtml: React.PropTypes.func
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
			tooltipOffset: {top: -20, left: 15},
			tooltipHtml: null
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

		let {margin, tooltipHtml} = this.props;

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

		this.setState({
			tooltip: {
				top: e.clientY + this.props.tooltipOffset.top,
				left: e.clientX + this.props.tooltipOffset.left,
				hidden: false,
				html: this._tooltipHtml(data, position)
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
