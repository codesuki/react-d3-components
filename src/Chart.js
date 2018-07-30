import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { refType } from './utils/createRef';
import { margitType } from './hocs/withDefaultProps';

export default class Chart extends Component {
    static propTypes = {
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        margin: margitType.isRequired,
        svgRoot: refType
    };

    render() {
        const {
            width,
            height,
            margin,
            viewBox,
            preserveAspectRatio,
            children,
            svgRoot
        } = this.props;

        return (
            <svg
                ref={svgRoot}
                width={width}
                height={height}
                viewBox={viewBox}
                preserveAspectRatio={preserveAspectRatio}
            >
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {children}
                </g>
            </svg>
        );
    }
}
