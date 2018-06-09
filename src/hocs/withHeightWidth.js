import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { margitType } from './withDefaultProps';

export const withHeightWidth = WrappedComponent => {
    class HeightWidth extends Component {
        static propTypes = {
            height: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
            margin: margitType.isRequired
        };

        calculateInner() {
            const { height, width, margin } = this.props;
            const innerHeight = height - margin.top - margin.bottom;
            const innerWidth = width - margin.left - margin.right;

            return {
                innerHeight,
                innerWidth
            };
        }

        render() {
            return (
                <WrappedComponent {...this.props} {...this.calculateInner()} />
            );
        }
    }

    return HeightWidth;
};
