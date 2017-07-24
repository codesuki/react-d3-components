import React, { PropTypes } from 'react';

const { number, string, array, object, func, oneOfType } = PropTypes;

const Bar = React.createClass({
    propTypes: {
        width: number.isRequired,
        height: number.isRequired,
        x: number.isRequired,
        y: number.isRequired,
        fill: string.isRequired,
        data: oneOfType([
            array,
            object
        ]).isRequired,
        onMouseEnter: func,
        onMouseLeave: func,
        onMouseClick: func
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
            onMouseLeave,
            onMouseClick,
        } = this.props;

        return <rect
            className="bar"
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fill}
            onMouseMove={e => onMouseEnter(e, data)}
            onMouseLeave={e => onMouseLeave(e)}
            onClick={e => { onMouseClick && onMouseClick(e, data); }}
        />;
    }
});

export default Bar;
