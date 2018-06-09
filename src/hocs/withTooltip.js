import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TooltipComponent from '../Tooltip';
import { getPositionBySvgAndEvent } from '../utils/get-position';
import { createRef } from '../utils/createRef';

export const lerp = (t, a, b) => (1 - t) * a + t * b;

export const withTooltip = WrappedComponent => {
    class Tooltip extends Component {
        static propTypes = {
            tooltipContained: PropTypes.bool,
            tooltipHtml: PropTypes.func,
            tooltipMode: PropTypes.oneOf(['mouse', 'element', 'fixed']),
            tooltipOffset: PropTypes.objectOf(PropTypes.number)
        };

        static defaultProps = {
            tooltipContained: false,
            tooltipHtml: null,
            tooltipMode: 'mouse',
            tooltipOffset: { top: -35, left: 0 }
        };

        state = {
            tooltipClientX: 0,
            tooltipClientY: 0,
            tooltipData: null,
            tooltipHidden: true
        };

        svgRoot = createRef();

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    {...this.state}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    renderTooltip={this.renderTooltip}
                    svgRoot={this.svgRoot}
                />
            );
        }

        renderTooltip = getTooltipHtml => {
            const svg = this.svgRoot.current;
            if (!svg) {
                return null;
            }

            const {
                tooltipClientX,
                tooltipClientY,
                tooltipData,
                tooltipHidden
            } = this.state;
            const {
                margin,
                tooltipContained,
                tooltipMode,
                tooltipOffset
            } = this.props;

            const rect = svg.getBoundingClientRect();

            const position = getPositionBySvgAndEvent({
                svg,
                clientY: tooltipClientY,
                clientX: tooltipClientX,
                margin
            });

            const [html, xPos, yPos] = getTooltipHtml(tooltipData, position);

            const svgTop = rect.top + margin.top;
            const svgLeft = rect.left + margin.left;

            let top = 0;
            let left = 0;

            if (tooltipMode === 'fixed') {
                top = svgTop + tooltipOffset.top;
                left = svgLeft + tooltipOffset.left;
            } else if (tooltipMode === 'element') {
                top = svgTop + yPos + tooltipOffset.top;
                left = svgLeft + xPos + tooltipOffset.left;
            } else {
                // mouse
                top = tooltipClientY + tooltipOffset.top;
                left = tooltipClientX + tooltipOffset.left;
            }

            let translate = 50;

            if (tooltipContained) {
                const t = position[0] / rect.width;
                translate = lerp(t, 0, 100);
            }

            return (
                <TooltipComponent
                    hidden={tooltipHidden}
                    html={html}
                    left={left}
                    top={top}
                    translate={translate}
                />
            );
        };

        onMouseEnter = (event, data) => {
            if (!this.props.tooltipHtml) {
                return;
            }

            event.preventDefault();

            this.setState({
                tooltipClientX: event.clientX,
                tooltipClientY: event.clientY,
                tooltipData: data,
                tooltipHidden: false
            });
        };

        onMouseLeave = e => {
            if (!this.props.tooltipHtml) {
                return;
            }

            e.preventDefault();

            this.setState({
                tooltipHidden: true
            });
        };
    }

    return Tooltip;
};
