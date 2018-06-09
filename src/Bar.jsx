import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

const { number, string, array, object, func, oneOfType } = PropTypes;

const Bar = createReactClass({
    propTypes: {
        width: number.isRequired,
        height: number.isRequired,
        x: number.isRequired,
        y: number.isRequired,
        fill: string.isRequired,
        data: oneOfType([array, object]).isRequired,
        onMouseEnter: func,
        onMouseLeave: func
    },

    render() {
        const {
            x,
            y,
            width,
            height,
            fill,
            data,
            onMouseEnter,
            onMouseLeave
        } = this.props;

        return (
            <rect
                className="bar"
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fill}
                onMouseMove={e => onMouseEnter(e, data)}
                onMouseLeave={e => onMouseLeave(e)}
            />
        );
    }
});

export default Bar;
