import React, { PropTypes } from 'react';

const { number, node } = PropTypes;

const Tooltip = React.createClass({
    propTypes: {
        top: number.isRequired,
        left: number.isRequired,
        html: node,
        translate: number
    },

    getDefaultProps() {
        return {
            top: 150,
            left: 100,
            html: '',
            translate: 50
        };
    },

    render() {
        const {top, left, hidden, html, translate} = this.props;

        const style = {
            display: hidden ? 'none' : 'block',
            position: 'fixed',
            top,
            left,
            transform: `translate(-${translate}%, 0)`,
            pointerEvents: 'none'
        };

        return <div className="tooltip" style={style}>{html}</div>;
    }
});

export default Tooltip;
