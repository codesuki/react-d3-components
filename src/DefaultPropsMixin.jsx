import React from 'react';
import d3 from 'd3';

export default {
    propTypes: {
        data: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,
        height: React.PropTypes.number.isRequired,
        width: React.PropTypes.number.isRequired,
        margin: React.PropTypes.shape({
            top: React.PropTypes.number,
            bottom: React.PropTypes.number,
            left: React.PropTypes.number,
            right: React.PropTypes.number
        }),
        xScale: React.PropTypes.func,
        yScale: React.PropTypes.func,
        colorScale: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            data: {label: 'No data available', values: [{x: 'No data available', y: 1}]},
            margin: {top: 0, bottom: 0, left: 0, right: 0},
            xScale: null,
            yScale: null,
            colorScale: d3.scale.category20()
        };
    }
};
