let React = require('react');

let Chart = React.createClass({
    propTypes: {
        height: React.PropTypes.number.isRequired,
        width: React.PropTypes.number.isRequired,
        margin: React.PropTypes.shape({
            top: React.PropTypes.number,
            bottom: React.PropTypes.number,
            left: React.PropTypes.number,
            right: React.PropTypes.number
        }).isRequired
    },

    render() {
        let {width, height, margin, viewBox, preserveAspectRatio, children} = this.props;

        return (
                <svg ref="svg" width={width} height={height} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} >
                <g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
                </svg>
        );
    }
});

module.exports = Chart;
