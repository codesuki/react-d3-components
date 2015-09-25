let React = require('react');
let d3 = require('d3');

let StackDataMixin = {
    propTypes: {
        offset: React.PropTypes.string
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
        let {offset, order, x, y, values} = props;

        let stack = d3.layout.stack()
                .offset(offset)
                .order(order)
                .x(x)
                .y(y)
                .values(values);

        this._data = stack(this._data);
    }
};

module.exports = StackDataMixin;
