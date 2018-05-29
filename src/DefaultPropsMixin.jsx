import { oneOfType, object, array, shape, func, number } from 'prop-types';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

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
            colorScale: scaleOrdinal(schemeCategory10)
        };
    }
};

export default DefaultPropsMixin;
