import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { memoize } from '../utils/memoize';

export default class Resizer extends Component {
    static propTypes = {
        resizeType: PropTypes.string.isRequired,
        cursor: PropTypes.string.isRequired,
        xExtent: PropTypes.array.isRequired,
        yExtent: PropTypes.array.isRequired,
        onMouseDown: PropTypes.func.isRequired,
        empty: PropTypes.func.isRequired,
        innerHeight: PropTypes.number.isRequired
    };

    onMouseDown = event => {
        this.props.onMouseDown(event, this.props.resizeType);
    };

    getTransform() {
        const { xExtent, yExtent, resizeType } = this.props;
        const x = xExtent[+/e$/.test(resizeType)];
        const y = yExtent[+/^s/.test(resizeType)];

        return `translate(${x}, ${y})`;
    }

    getGroupStyle = memoize(cursor => ({ cursor }));

    getRectStyle = memoize(isHidden => ({
        visibility: 'hidden',
        display: isHidden ? 'none' : null
    }));

    render() {
        const { resizeType, empty, cursor, innerHeight } = this.props;

        return (
            <g
                className={`resize ${resizeType}`}
                style={this.getGroupStyle(cursor)}
                transform={this.getTransform()}
                onMouseDown={this.onMouseDown}
            >
                <rect
                    width="6"
                    height={innerHeight}
                    x={/[ew]$/.test(resizeType) ? -3 : null}
                    y={/^[ns]/.test(resizeType) ? -3 : null}
                    style={this.getRectStyle(empty())}
                />
            </g>
        );
    }
}
