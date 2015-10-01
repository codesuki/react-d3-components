import React from 'react';
import d3 from 'd3';

import TransitionMixin from './TransitionMixin';

export default React.createClass({
    mixins: [TransitionMixin],

    getInitialState() {
        return {
            transform: null
        };
    },

    render() {
        return (
                <g transform={this.state.transform}>{this.props.children}</g>
        );
    }
});
