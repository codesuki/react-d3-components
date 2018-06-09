import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Tooltip extends Component {
    static propTypes = {
        top: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired,
        hidden: PropTypes.bool.isRequired,
        html: PropTypes.node,
        translate: PropTypes.number
    };

    static defaultProps = {
        html: '',
        translate: 50
    };

    render() {
        const { top, left, html, translate, hidden } = this.props;

        const style = {
            display: hidden ? 'none' : '',
            left,
            pointerEvents: 'none',
            position: 'fixed',
            top,
            transform: `translate(-${translate}%, 0)`
        };

        return (
            <div className="tooltip" style={style}>
                {html}
            </div>
        );
    }
}
