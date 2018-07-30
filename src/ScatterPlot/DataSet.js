import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Path extends Component {
    static propTypes = {
        data: PropTypes.any.isRequired,
        onMouseOver: PropTypes.func.isRequired
    };
    onMouseOver = event => this.props.onMouseOver(event, this.props.data);

    render() {
        // eslint-disable-next-line  no-unused-vars
        const { data, ...props } = this.props;
        return <path {...props} onMouseOver={this.onMouseOver} />;
    }
}

export default class DataSet extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        symbol: PropTypes.func.isRequired,
        xScale: PropTypes.func.isRequired,
        yScale: PropTypes.func.isRequired,
        colorScale: PropTypes.func.isRequired,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func
    };

    render() {
        const {
            data,
            symbol,
            xScale,
            yScale,
            colorScale,
            label,
            values,
            x,
            y,
            onMouseEnter,
            onMouseLeave
        } = this.props;
        const circles = data.map(stack =>
            values(stack).map((e, index) => {
                const translate = `translate(${xScale(x(e))}, ${yScale(y(e))})`;
                return (
                    <Path
                        key={`${label(stack)}.${index}`}
                        className="dot"
                        d={symbol()}
                        transform={translate}
                        fill={colorScale(label(stack))}
                        onMouseOver={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        data={e}
                    />
                );
            })
        );

        return <g>{circles}</g>;
    }
}
