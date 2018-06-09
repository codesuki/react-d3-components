import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* istanbul ignore next */
const emptyFn = () => {};

export default class Path extends Component {
    static propTypes = {
        className: PropTypes.string,
        d: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        fill: PropTypes.string,
        stroke: PropTypes.string.isRequired,
        strokeDasharray: PropTypes.string,
        strokeLinecap: PropTypes.string,
        strokeWidth: PropTypes.string,
        onMouseLeave: PropTypes.func,
        onMouseEnter: PropTypes.func
    };

    static defaultProps = {
        className: 'path',
        fill: 'none',
        strokeDasharray: 'none',
        strokeLinecap: 'butt',
        strokeWidth: '2',
        onMouseLeave: emptyFn,
        onMouseEnter: emptyFn
    };

    onMouseMove = event => {
        this.props.onMouseEnter(event, this.props.data);
    };

    render() {
        const {
            className,
            d,
            fill,
            onMouseLeave,
            stroke,
            strokeDasharray,
            strokeLinecap,
            strokeWidth,
            style
        } = this.props;

        return (
            <path
                className={className}
                d={d}
                fill={fill}
                onMouseLeave={onMouseLeave}
                onMouseMove={this.onMouseMove}
                stroke={stroke}
                strokeDasharray={strokeDasharray}
                strokeLinecap={strokeLinecap}
                strokeWidth={strokeWidth}
                style={style}
            />
        );
    }
}
