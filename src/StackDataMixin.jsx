import PropTypes from 'prop-types';
import { stack as d3Stack, stackOrderNone, stackOffsetNone } from 'd3-shape';

const { func } = PropTypes;

const StackDataMixin = {
    propTypes: {
        offset: func
    },

    getDefaultProps() {
        return {
            offset: stackOffsetNone,
            order: stackOrderNone
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

        const stack = d3Stack()
            .offset(offset)
            .order(order)
            .keys(['x', 'y']);

        /*this._data = stack(this._data);

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
        }*/
    }
};

export default StackDataMixin;
