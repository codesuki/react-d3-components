import PropTypes from 'prop-types';
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
        const { offset, order, x, y, values } = props;

        const stack = d3.layout
            .stack()
            .offset(offset)
            .order(order)
            .x(x)
            .y(y)
            .values(values);

        this._data = stack(this._data);

        for (let m = 0; m < values(this._data[0]).length; m++) {
            let positiveBase = 0;
            let negativeBase = 0;
            for (let n = 0; n < this._data.length; n++) {
                const value = y(values(this._data[n])[m]);
                if (value < 0) {
                    values(this._data[n])[m].y0 = negativeBase;
                    negativeBase += value;
                } else {
                    values(this._data[n])[m].y0 = positiveBase;
                    positiveBase += value;
                }
            }
        }
    }
};

export default StackDataMixin;
