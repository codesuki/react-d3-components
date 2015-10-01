import React from 'react';
import d3 from 'd3';

import TransitionMixin from "./TransitionMixin";

export default React.createClass({
    mixins: [TransitionMixin],

    propTypes: {
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        fill: React.PropTypes.string.isRequired,
        data: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]).isRequired,
        onMouseEnter: React.PropTypes.func,
        onMouseLeave: React.PropTypes.func
    },

    getInitialState() {
        return {
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height,
            fill: this.props.fill,
            opacity: 1
        };
    },

    render() {
        let {x,
             y,
             width,
             height,
             fill,
             data,
             onMouseEnter,
             onMouseLeave} = this.props;

        return (
                <rect
            className="bar"
            x={this.state.x}
            y={this.state.y}
            width={this.state.width}
            height={this.state.height}
            fill={this.state.fill}
            opacity={this.state.opacity}
            onMouseMove={ e => { onMouseEnter(e, data); } }
            onMouseLeave={ e => { onMouseLeave(e); } }
                />
        );
    }
});
