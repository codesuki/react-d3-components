import React, { Component } from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';

export const withStackData = WrappedComponent => {
    class StackData extends Component {
        static propTypes = {
            x: PropTypes.func.isRequierd,
            y: PropTypes.func.isRequierd,
            values: PropTypes.func.isRequierd,
            data: PropTypes.array.isRequierd,
            offset: PropTypes.string,
            order: PropTypes.string
        };

        static defaultProps = {
            offset: 'zero',
            order: 'default'
        };

        stackData() {
            const { offset, order, x, y, values, data } = this.props;
            const stack = d3.layout
                .stack()
                .offset(offset)
                .order(order)
                .x(x)
                .y(y)
                .values(values);
            const stackData = stack(data);

            for (let m = 0; m < values(stackData[0]).length; m++) {
                let positiveBase = 0;
                let negativeBase = 0;
                for (let n = 0; n < stackData.length; n++) {
                    const value = y(values(stackData[n])[m]);
                    if (value < 0) {
                        values(stackData[n])[m].y0 = negativeBase;
                        negativeBase += value;
                    } else {
                        values(stackData[n])[m].y0 = positiveBase;
                        positiveBase += value;
                    }
                }
            }

            return stackData;
        }
        render() {
            return <WrappedComponent {...this.props} data={this.stackData()} />;
        }
    }

    return StackData;
};
