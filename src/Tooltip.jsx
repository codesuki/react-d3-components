let React = require('react');
let d3 = require('d3');

let Tooltip = React.createClass({
    propTypes: {
        top: React.PropTypes.number.isRequired,
        left: React.PropTypes.number.isRequired,
        html: React.PropTypes.node,
        translate: React.PropTypes.number
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
        let {top, left, hidden, html, translate} = this.props;

        let style = {
            display: hidden ? 'none' : 'block',
            position: 'fixed',
            top: top,
            left: left,
            transform: `translate(-${translate}%, 0)`,
            pointerEvents: 'none'
        };

        return (
                <div className="tooltip" style={style}>{html}</div>
        );
    }
});

module.exports = Tooltip;
