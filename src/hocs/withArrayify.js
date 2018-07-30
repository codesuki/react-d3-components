import React, { Component } from 'react';

export const defaultData = {
    label: 'No data available',
    values: [{ x: 'No data available', y: 1 }]
};

export const withArrayify = WrappedComponent => {
    class Arrayify extends Component {
        getArrayData() {
            const { data } = this.props;

            if (!data) {
                return [defaultData];
            } else if (!Array.isArray(data)) {
                return [data];
            }

            return data;
        }

        render() {
            return (
                <WrappedComponent {...this.props} data={this.getArrayData()} />
            );
        }
    }

    return Arrayify;
};
