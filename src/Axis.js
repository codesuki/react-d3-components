import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { d3ScaleRange } from './utils/d3-utils';

const shapeRendering = { shapeRendering: 'crispEdges' };

const TRANSFORM_PH = '{}';

export default class Axis extends Component {
    static propTypes = {
        tickArguments: PropTypes.array,
        tickValues: PropTypes.arrayOf(PropTypes.number),
        tickFormat: PropTypes.func,
        tickDirection: PropTypes.oneOf(['horizontal', 'vertical', 'diagonal']),
        innerTickSize: PropTypes.number,
        tickPadding: PropTypes.number,
        outerTickSize: PropTypes.number,
        scale: PropTypes.func.isRequired,
        className: PropTypes.string,
        zero: PropTypes.number,
        orientation: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
            .isRequired,
        label: PropTypes.string
    };

    static defaultProps = {
        tickArguments: [10],
        tickValues: null,
        tickFormat: null,
        tickDirection: 'horizontal',
        innerTickSize: 6,
        tickPadding: 3,
        outerTickSize: 6,
        className: 'axis',
        zero: 0,
        label: ''
    };

    render() {
        const {
            height,
            tickArguments,
            tickValues,
            tickDirection,
            innerTickSize,
            tickPadding,
            outerTickSize,
            scale,
            orientation,
            zero,
            width,
            className,
            label
        } = this.props;

        let { tickFormat } = this.props;

        let ticks =
            tickValues == null
                ? scale.ticks
                    ? scale.ticks.apply(scale, tickArguments)
                    : scale.domain()
                : tickValues;

        if (!tickFormat) {
            if (scale.tickFormat) {
                tickFormat = scale.tickFormat.apply(scale, tickArguments);
            } else {
                tickFormat = x => x;
            }
        }

        // TODO: is there a cleaner way? removes the 0 tick if axes are crossing
        if (zero != height && zero != width && zero != 0) {
            ticks = ticks.filter(element => element != 0);
        }

        const tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

        const sign = orientation === 'top' || orientation === 'left' ? -1 : 1;

        const range = d3ScaleRange(scale);

        const activeScale = scale.rangeBand
            ? e => scale(e) + scale.rangeBand() / 2
            : scale;

        let transform,
            x,
            y,
            x2,
            y2,
            dy,
            textAnchor,
            d,
            labelElement,
            tickRotation = 0;

        if (orientation === 'bottom' || orientation === 'top') {
            transform = `translate(${TRANSFORM_PH}, 0)`;
            x = 0;
            y = sign * tickSpacing;
            x2 = 0;
            y2 = sign * innerTickSize;
            dy = sign < 0 ? '0em' : '.71em';
            textAnchor = 'middle';
            d = `M${range[0]}, ${sign * outerTickSize}V0H${range[1]}V${sign *
                outerTickSize}`;
            if (tickDirection === 'vertical') {
                tickRotation = -90;
                x = -tickSpacing;
                y = -innerTickSize;
                textAnchor = 'end';
            } else if (tickDirection === 'diagonal') {
                tickRotation = -60;
                x = -tickSpacing;
                y = 0;
                textAnchor = 'end';
            }

            labelElement = (
                <text
                    className={`${className} label`}
                    textAnchor={'end'}
                    x={width}
                    y={-6}
                >
                    {label}
                </text>
            );
        } else {
            transform = `translate(0, ${TRANSFORM_PH})`;
            x = sign * tickSpacing;
            y = 0;
            x2 = sign * innerTickSize;
            y2 = 0;
            dy = '.32em';
            textAnchor = sign < 0 ? 'end' : 'start';
            d = `M${sign * outerTickSize}, ${range[0]}H0V${range[1]}H${sign *
                outerTickSize}`;
            if (tickDirection === 'vertical') {
                tickRotation = -90;
                x -= sign * tickSpacing;
                y = -(tickSpacing + innerTickSize);
                textAnchor = 'middle';
            } else if (tickDirection === 'diagonal') {
                tickRotation = -60;
                x -= sign * tickSpacing;
                y = -(tickSpacing + innerTickSize);
                textAnchor = 'middle';
            }

            labelElement = (
                <text
                    className={`${className} label`}
                    textAnchor="end"
                    y={6}
                    dy={orientation === 'left' ? '.75em' : '-1.25em'}
                    transform="rotate(-90)"
                >
                    {label}
                </text>
            );
        }

        return (
            <g
                ref="axis"
                className={className}
                transform={this.getTranslateString()}
                style={shapeRendering}
            >
                <rect className="axis-background" fill="none" />
                {this.renderTickElements({
                    activeScale,
                    dy,
                    textAnchor,
                    tickFormat,
                    tickRotation,
                    ticks,
                    transform,
                    x,
                    x2,
                    y,
                    y2
                })}
                <path className="domain" d={d} fill="none" stroke="#aaa" />
                {labelElement}
            </g>
        );
    }

    renderTickElements({
        activeScale,
        dy,
        textAnchor,
        tickFormat,
        tickRotation,
        ticks,
        transform,
        x,
        x2,
        y,
        y2
    }) {
        return ticks.map((tick, index) => {
            const position = activeScale(tick);
            const translate = transform.replace(TRANSFORM_PH, position);
            return (
                <g
                    key={`${tick}.${index}`}
                    className="tick"
                    transform={translate}
                >
                    <line x2={x2} y2={y2} stroke="#aaa" />
                    <text
                        x={x}
                        y={y}
                        dy={dy}
                        textAnchor={textAnchor}
                        transform={`rotate(${tickRotation})`}
                    >
                        {tickFormat(tick)}
                    </text>
                </g>
            );
        });
    }

    getTranslateString() {
        const { orientation, height, width, zero } = this.props;
        const isZero = zero == 0;

        switch (orientation) {
            case 'top':
                return `translate(0, ${zero})`;
            case 'bottom':
                return `translate(0, ${isZero ? height : zero})`;
            case 'left':
                return `translate(${zero}, 0)`;
            case 'right':
                return `translate(${isZero ? width : zero}, 0)`;
        }

        return '';
    }
}
