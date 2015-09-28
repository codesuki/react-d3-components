let React = require('react');
let d3 = require('d3');

let DefaultScalesMixin = {
    propTypes: {
        barPadding: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            barPadding: 0.5
        };
    },

    componentWillMount() {
        this._makeScales(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this._makeScales(nextProps);
    },

    _makeScales(props) {
        let {xScale, xIntercept, yScale, yIntercept} = props;

        if (!xScale) {
            [this._xScale, this._xIntercept] = this._makeXScale(props);
        } else {
            [this._xScale, this._xIntercept] = [xScale, xIntercept];
        }

        if (!yScale) {
            [this._yScale, this._yIntercept] = this._makeYScale(props);
        } else {
            [this._yScale, this._yIntercept] = [yScale, yIntercept];
        }
    },

    _makeXScale(props) {
        let {x, values} = props;
        let data = this._data;

        if (typeof (x(values(data[0])[0])) === 'number') {
            return this._makeLinearXScale(props);
        } else if (typeof x(values(data[0])[0]).getMonth === 'function') {
            return this._makeTimeXScale(props);
        } else {
            return this._makeOrdinalXScale(props);
        }
    },

    _makeLinearXScale(props) {
        let {x, values} = props;
        let [data, innerWidth] = [this._data, this._innerWidth];

        let extents =
                d3.extent(
                    Array.prototype.concat.apply([],
                                                 data.map(stack => {
                                                     return values(stack).map(e => {
                                                         return x(e);
                                                     });
                                                 })));

        let scale = d3.scale.linear()
                .domain(extents)
                .range([0, innerWidth]);

        let zero = d3.max([0, scale.domain()[0]]);
        let xIntercept = scale(zero);

        return [scale, xIntercept];
    },

    _makeOrdinalXScale(props) {
        let {x, values, barPadding} = props;
        let [data, innerWidth] = [this._data, this._innerWidth];

        let scale = d3.scale.ordinal()
                .domain(values(data[0]).map(e => { return x(e); }))
                .rangeRoundBands([0, innerWidth], barPadding);

        return [scale, 0];
    },

    _makeTimeXScale(props) {
        let {x, values, barPadding} = props;
        let [data, innerWidth] = [this._data, this._innerWidth];

        let minDate = d3.min(values(data[0]), x);

        let maxDate = d3.max(values(data[0]), x);

        let scale = d3.time.scale()
                .domain([minDate, maxDate])
                .range([0, innerWidth]);

        return [scale, 0];
    },

    _makeYScale(props) {
        let {y, values} = props;
        let data = this._data;

        if (typeof y(values(data[0])[0]) === 'number') {
            return this._makeLinearYScale(props);
        } else {
            return this._makeOrdinalYScale(props);
        }
    },

    _makeLinearYScale(props) {
        let {y, y0, values, groupedBars} = props;
        let [data, innerHeight] = [this._data, this._innerHeight];

        let extents =
                d3.extent(
                    Array.prototype.concat.apply([],
                                                 data.map(stack => {
                                                     return values(stack).map(e => {
                                                         if (groupedBars) {
                                                             return y(e);
                                                         } else {
                                                             return y0(e) + y(e);
                                                         }
                                                     });
                                                 })));

        extents = [d3.min([0, extents[0]]), extents[1]];

        let scale = d3.scale.linear()
                .domain(extents)
                .range([innerHeight, 0]);

        let zero = d3.max([0, scale.domain()[0]]);
        let yIntercept = scale(zero);

        return [scale, yIntercept];
    },

    _makeOrdinalYScale() {
        let [data, innerHeight] = [this._data, this._innerHeight];

        let scale = d3.scale.ordinal()
                .range([innerHeight, 0]);

        let yIntercept = scale(0);

        return [scale, yIntercept];
    }
};

module.exports = DefaultScalesMixin;
