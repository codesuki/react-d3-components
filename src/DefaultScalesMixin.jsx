import PropTypes from 'prop-types';
import d3 from 'd3';

const { number } = PropTypes;

const DefaultScalesMixin = {
    propTypes: {
        barPadding: number
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
        const { xScale, xIntercept, yScale, yIntercept } = props;

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
        const { x, values } = props;
        const data = this._data;

        if (typeof x(values(data[0])[0]) === 'number') {
            return this._makeLinearXScale(props);
        } else if (typeof x(values(data[0])[0]).getMonth === 'function') {
            return this._makeTimeXScale(props);
        } else {
            return this._makeOrdinalXScale(props);
        }
    },

    _makeLinearXScale(props) {
        const { x, values } = props;
        const data = this._data;

        const extentsData = data.map(stack => values(stack).map(e => x(e)));
        const extents = d3.extent(
            Array.prototype.concat.apply([], extentsData)
        );

        const scale = d3.scale
            .linear()
            .domain(extents)
            .range([0, this._innerWidth]);

        const zero = d3.max([0, scale.domain()[0]]);
        const xIntercept = scale(zero);

        return [scale, xIntercept];
    },

    _makeOrdinalXScale(props) {
        const { x, values, barPadding } = props;

        const scale = d3.scale
            .ordinal()
            .domain(values(this._data[0]).map(e => x(e)))
            .rangeRoundBands([0, this._innerWidth], barPadding);

        return [scale, 0];
    },

    _makeTimeXScale(props) {
        const { x, values } = props;

        const minDate = d3.min(values(this._data[0]), x);
        const maxDate = d3.max(values(this._data[0]), x);

        const scale = d3.time
            .scale()
            .domain([minDate, maxDate])
            .range([0, this._innerWidth]);

        return [scale, 0];
    },

    _makeYScale(props) {
        const { y, values } = props;
        const data = this._data;

        if (typeof y(values(data[0])[0]) === 'number') {
            return this._makeLinearYScale(props);
        } else {
            return this._makeOrdinalYScale(props);
        }
    },

    _makeLinearYScale(props) {
        const { y, y0, values, groupedBars } = props;

        const extentsData = this._data.map(stack =>
            values(stack).map(e => groupedBars ? y(e) : y0(e) + y(e))
        );
        let extents = d3.extent(Array.prototype.concat.apply([], extentsData));

        extents = [d3.min([0, extents[0]]), extents[1]];

        const scale = d3.scale
            .linear()
            .domain(extents)
            .range([this._innerHeight, 0]);

        const zero = d3.max([0, scale.domain()[0]]);
        const yIntercept = scale(zero);

        return [scale, yIntercept];
    },

    _makeOrdinalYScale() {
        const scale = d3.scale.ordinal().range([this._innerHeight, 0]);

        const yIntercept = scale(0);

        return [scale, yIntercept];
    }
};

export default DefaultScalesMixin;
