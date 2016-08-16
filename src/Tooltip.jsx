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
        const hasHtmlObj = (typeof html === 'object' && !!html.__html);

        let style = {
            display: hidden ? 'none' : 'block',
            position: 'fixed',
            top: top,
            left: left,
            transform: `translate(-${translate}%, 0)`,
            pointerEvents: 'none'
        };

        return (!hasHtmlObj ? (
          <div className="tooltip" style={style}>{html}</div>
        ) : (
          <div
            className="tooltip"
            style={style}
            dangerouslySetInnerHTML={html}
          />
        ));
    }
});

module.exports = Tooltip;
