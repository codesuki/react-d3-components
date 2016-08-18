import { PropTypes } from 'react';
import d3 from 'd3';

const { string } = PropTypes;

const StackDataMixin = {
    propTypes: {
        offset: string
    },

    getDefaultProps() {
        return {
            offset: 'zero',
            order: 'default'
        };
    },

    componentWillMount() {
        this._stackData(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this._stackData(nextProps);
    },

    _stackData(props) {
        const {offset, order, x, y, values} = props;

        const stack = d3.layout.stack()
            .offset(offset)
            .order(order)
            .x(x)
            .y(y)
            .values(values);

        this._data = stack(this._data);
    }
};

export default StackDataMixin;
