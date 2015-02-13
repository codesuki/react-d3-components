let React = require('./ReactProvider');
let d3 = require('./D3Provider');

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

	componentDidMount() {
		this._svg_node = this.getDOMNode().getElementsByTagName("svg")[0];
	},

	onMouseEnter(e, d) {
		let {margin, xScale, yScale, tooltipHtml} = this.props;

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
				top: e.pageY - 20,
				left: e.pageX + 15,
				hidden: false,
				html: tooltipHtml(d, position, xScale, yScale)
			}
		});
	},

	onMouseLeave(e) {
		this.setState({
			tooltip: {
				hidden: true
			}
		});
	}
};

module.exports = TooltipMixin;
