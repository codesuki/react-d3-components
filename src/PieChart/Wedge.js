import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Wedge extends Component {
    static propTypes = {
        d: PropTypes.string.isRequired,
        fill: PropTypes.string.isRequired,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        data: PropTypes.any
    };

    onMouseMove = evt => this.props.onMouseEnter(evt, this.props.data);

    render() {
        const { fill, d, onMouseLeave } = this.props;

        return (
            <path
                fill={fill}
                d={d}
                onMouseMove={this.onMouseMove}
                onMouseLeave={onMouseLeave}
            />
        );
    }
}
