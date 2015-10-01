import React from 'react';
import d3 from 'd3';

import TransitionMixin from './TransitionMixin';

export default React.createClass({
    mixins: [TransitionMixin],

    propTypes: {
        className: React.PropTypes.string,
        stroke: React.PropTypes.string.isRequired,
        strokeLinecap: React.PropTypes.string,
        strokeWidth: React.PropTypes.string,
        strokeDasharray: React.PropTypes.string,
        fill: React.PropTypes.string,
        d: React.PropTypes.string.isRequired,
        data: React.PropTypes.array.isRequired
    },

    getInitialState() {
        return {
            transform: null
        };
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
        let {className,
             stroke,
             strokeWidth,
             strokeLinecap,
             strokeDasharray,
             fill,
             d,
             style,
             data,
             onMouseEnter,
             onMouseLeave} = this.props;

        return (
                <path
            className={className}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
            strokeDasharray={strokeDasharray}
            fill={fill}
            d={d}
            transform={this.state.transform}
            onMouseMove={ evt => { onMouseEnter(evt, data); } }
            onMouseLeave={ evt => { onMouseLeave(evt); } }
            style={style}
                />
        );
    }
});
