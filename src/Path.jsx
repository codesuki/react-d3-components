import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

const { string, array } = PropTypes;

const Path = createReactClass({
    propTypes: {
        className: string,
        stroke: string.isRequired,
        strokeLinecap: string,
        strokeWidth: string,
        strokeDasharray: string,
        fill: string,
        d: string.isRequired,
        data: array.isRequired
    },

    getDefaultProps() {
        return {
            className: 'path',
            fill: 'none',
            strokeWidth: '2',
            strokeLinecap: 'butt',
            strokeDasharray: 'none'
        };
    },

    render() {
        const {
            className,
            stroke,
            strokeWidth,
            strokeLinecap,
            strokeDasharray,
            fill,
            d,
            style,
            data,
            onMouseEnter,
            onMouseLeave
        } = this.props;

        return (
            <path
                className={className}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap={strokeLinecap}
                strokeDasharray={strokeDasharray}
                fill={fill}
                d={d}
                onMouseMove={evt => onMouseEnter(evt, data)}
                onMouseLeave={evt => onMouseLeave(evt)}
                style={style}
            />
        );
    }
});

export default Path;
