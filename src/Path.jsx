import React from 'react';
import { string, array } from 'prop-types';

const Path = ({
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
}) =>
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
;

Path.propTypes = {
    className: string,
    stroke: string.isRequired,
    strokeLinecap: string,
    strokeWidth: string,
    strokeDasharray: string,
    fill: string,
    d: string.isRequired,
    data: array.isRequired
};

Path.defaultProps = {
    className: 'path',
    fill: 'none',
    strokeWidth: '2',
    strokeLinecap: 'butt',
    strokeDasharray: 'none'
};

export default Path;
