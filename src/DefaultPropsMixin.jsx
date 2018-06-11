import PropTypes from 'prop-types';
import d3 from 'd3';

const { oneOfType, object, array, shape, func, number } = PropTypes;

const DefaultPropsMixin = {
    propTypes: {
        data: oneOfType([object, array]).isRequired,
        height: number.isRequired,
        width: number.isRequired,
        margin: shape({
            top: number,
            bottom: number,
            left: number,
            right: number
        }),
        xScale: func,
        yScale: func,
        colorScale: func
    },

    getDefaultProps() {
        return {
            data: {
                label: 'No data available',
                values: [{ x: 'No data available', y: 1 }]
            },
            margin: { top: 0, bottom: 0, left: 0, right: 0 },
            xScale: null,
            yScale: null,
            colorScale: d3.scale.category20()
        };
    }
};

export default DefaultPropsMixin;
