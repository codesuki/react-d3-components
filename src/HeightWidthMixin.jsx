let HeightWidthMixin = {
    componentWillMount() {
        this._calculateInner(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this._calculateInner(nextProps);
    },

    _calculateInner(props) {
        let {height, width, margin} = props;

        this._innerHeight = height - margin.top - margin.bottom;
        this._innerWidth = width - margin.left - margin.right;
    }
};

module.exports = HeightWidthMixin;
