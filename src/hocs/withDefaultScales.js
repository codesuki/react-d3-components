import React, { Component } from 'react';
import d3 from 'd3';
import PropTypes from 'prop-types';

export const withDefaultScales = WrappedComponent => {
    class DefaultScales extends Component {
        static propTypes = {
            barPadding: PropTypes.number
        };

        static defaultProps = {
            barPadding: 0.5
        };

        render() {
            return <WrappedComponent {...this.props} {...this.makeScales()} />;
        }

        makeScales() {
            let { xScale, xIntercept, yScale, yIntercept } = this.props;

            if (!xScale) {
                [xScale, xIntercept] = this._makeXScale();
            }

            if (!yScale) {
                [yScale, yIntercept] = this._makeYScale();
            }

            return {
                xScale,
                xIntercept,
                yScale,
                yIntercept
            };
        }

        _makeXScale() {
            const { x, values, data } = this.props;

            if (typeof x(values(data[0])[0]) === 'number') {
                return this._makeLinearXScale();
            }

            if (typeof x(values(data[0])[0]).getMonth === 'function') {
                return this._makeTimeXScale();
            }

            return this._makeOrdinalXScale();
        }

        _makeLinearXScale() {
            const { x, values, data, innerWidth } = this.props;
            const extentsData = data.map(stack => values(stack).map(e => x(e)));
            const extents = d3.extent(
                Array.prototype.concat.apply([], extentsData)
            );

            const scale = d3.scale
                .linear()
                .domain(extents)
                .range([0, innerWidth]);

            const zero = d3.max([0, scale.domain()[0]]);
            const xIntercept = scale(zero);

            return [scale, xIntercept];
        }

        _makeOrdinalXScale() {
            const { x, values, barPadding, data, innerWidth } = this.props;
            const scale = d3.scale
                .ordinal()
                .domain(values(data[0]).map(e => x(e)))
                .rangeRoundBands([0, innerWidth], barPadding);

            return [scale, 0];
        }

        _makeTimeXScale() {
            const { x, values, data, innerWidth } = this.props;
            const minDate = d3.min(values(data[0]), x);
            const maxDate = d3.max(values(data[0]), x);

            const scale = d3.time
                .scale()
                .domain([minDate, maxDate])
                .range([0, innerWidth]);

            return [scale, 0];
        }

        _makeYScale() {
            const { y, values, data } = this.props;

            if (typeof y(values(data[0])[0]) === 'number') {
                return this._makeLinearYScale();
            }

            return this._makeOrdinalYScale();
        }

        _makeLinearYScale() {
            const {
                y,
                y0,
                values,
                groupedBars,
                data,
                innerHeight
            } = this.props;
            const extentsData = data.map(stack =>
                values(stack).map(e => groupedBars ? y(e) : y0(e) + y(e))
            );
            let extents = d3.extent(
                Array.prototype.concat.apply([], extentsData)
            );

            extents = [d3.min([0, extents[0]]), extents[1]];

            const scale = d3.scale
                .linear()
                .domain(extents)
                .range([innerHeight, 0]);

            const zero = d3.max([0, scale.domain()[0]]);
            const yIntercept = scale(zero);

            return [scale, yIntercept];
        }

        _makeOrdinalYScale() {
            const { innerHeight } = this.props;
            const scale = d3.scale.ordinal().range([innerHeight, 0]);

            const yIntercept = scale(0);

            return [scale, yIntercept];
        }
    }

    return DefaultScales;
};
