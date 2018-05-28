import React from 'react';
import { number, node } from 'prop-types';

const Tooltip = ({ top, left, hidden, html, translate }) => {
    const style = {
        display: hidden ? 'none' : 'block',
        position: 'fixed',
        top,
        left,
        transform: `translate(-${translate}%, 0)`,
        pointerEvents: 'none'
    };

    return (
        <div className="tooltip" style={style}>
            {html}
        </div>
    );
};

Tooltip.propTypes = {
    top: number.isRequired,
    left: number.isRequired,
    html: node,
    translate: number
};

Tooltip.defaultProps = {
    top: 150,
    left: 100,
    html: '',
    translate: 50
};

export default Tooltip;
