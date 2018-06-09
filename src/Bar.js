import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Bar extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        fill: PropTypes.string.isRequired,
        data: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
            .isRequired,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func
    };

    onMouseMove = event => this.props.onMouseEnter(event, this.props.data);

    render() {
        const { x, y, width, height, fill, onMouseLeave } = this.props;

        return (
            <rect
                className="bar"
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fill}
                onMouseMove={this.onMouseMove}
                onMouseLeave={onMouseLeave}
            />
        );
    }
}
