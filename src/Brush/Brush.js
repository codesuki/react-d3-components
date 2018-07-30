import React, { Component } from 'react';

import Chart from '../Chart';
import Axis from '../Axis';

import { createRef } from '../utils/createRef';
import { d3ScaleRange } from '../utils/d3-utils';
import { getPositionBySvgAndEvent } from '../utils/get-position';

import Resizer from './Resizer';
import { extentStyle, gStyle, rectStyle } from './styles';
import { getD3SvgBrushResizes, getD3SvgBrushCursor } from './D3Adapter';

const MOUSE_MODE_DRAG = 'drag';
const MOUSE_MODE_RESIZE = 'resize';

const getBrushResizes = (xScale, yScale) => {
    const x = !xScale;
    const y = !yScale;
    const index = (x << 1) | y;

    return getD3SvgBrushResizes(index);
};

// TODO: add y axis support
export class Brush extends Component {
    static defaultProps = {
        xScale: null,
        yScale: null
    };

    state = {
        resizers: getD3SvgBrushResizes(0),
        xExtent: [0, 0],
        yExtent: [0, 0],
        xExtentDomain: undefined,
        yExtentDomain: undefined
    };

    componentWillMount() {
        const { xScale, yScale, extent } = this.props;
        this._extent(extent);

        this.setState({
            resizers: getBrushResizes(xScale, yScale)
        });
    }

    componentWillReceiveProps(nextProps) {
        // when <Brush/> is used inside a component
        // we should not set the extent prop on every redraw of the parent, because it will
        // stop us from actually setting the extent with the brush.
        const { xScale, yScale } = this.props;
        if (nextProps.xScale !== xScale) {
            this._extent(nextProps.extent, nextProps.xScale);
            this.setState({
                resizers: getBrushResizes(xScale, yScale)
            });
        }
    }

    svgRoot = createRef();

    renderResizers() {
        const { innerHeight } = this.props;
        const { resizers, xExtent, yExtent } = this.state;

        return resizers.map(resizeType => (
            <Resizer
                key={resizeType}
                xExtent={xExtent}
                yExtent={yExtent}
                resizeType={resizeType}
                innerHeight={innerHeight}
                cursor={getD3SvgBrushCursor(resizeType)}
                onMouseDown={this.onMouseDownResizer}
                empty={this.isEmpty}
            />
        ));
    }

    renderBackground(xRange, yRange) {
        const { innerHeight } = this.props;

        return (
            <rect
                className="background"
                style={rectStyle}
                x={xRange ? xRange[0] : ''}
                y={yRange ? yRange[0] : ''}
                width={xRange ? xRange[1] - xRange[0] : ''}
                height={yRange ? yRange[1] - yRange[0] : innerHeight}
                onMouseDown={this.onMouseDownBackground}
            />
        );
    }

    renderExtent() {
        const { innerHeight, xScale } = this.props;
        const { xExtent } = this.state;

        if (xScale) {
            return (
                <rect
                    className="extent"
                    style={extentStyle}
                    x={xExtent[0]}
                    width={xExtent[1] - xExtent[0]}
                    height={innerHeight}
                    onMouseDown={this.onMouseDownExtent}
                />
            );
        }

        return null;
    }
    render() {
        const { innerHeight, innerWidth, xScale, yScale } = this.props;

        const xRange = xScale ? d3ScaleRange(xScale) : null;
        const yRange = yScale ? d3ScaleRange(yScale) : null;

        // TODO: it seems like actually we can have both x and y scales at the same time. need to find example.
        const {
            height,
            width,
            margin,
            viewBox,
            preserveAspectRatio,
            xAxis,
            children
        } = this.props;

        return (
            <Chart
                height={height}
                width={width}
                margin={margin}
                viewBox={viewBox}
                preserveAspectRatio={preserveAspectRatio}
                svgRoot={this.svgRoot}
            >
                <g
                    style={gStyle}
                    onMouseUp={this.onMouseUp}
                    onMouseMove={this.onMouseMove}
                >
                    {this.renderBackground(xRange, yRange)}
                    {this.renderExtent()}
                    {this.renderResizers()}
                </g>
                <Axis
                    className="x axis"
                    orientation="bottom"
                    scale={xScale}
                    height={innerHeight}
                    width={innerWidth}
                    {...xAxis}
                />
                {children}
            </Chart>
        );
    }

    getMousePosition({ clientY, clientX }) {
        const svg = this.svgRoot.current;
        const { margin } = this.props;

        return getPositionBySvgAndEvent({
            svg,
            clientY,
            clientX,
            margin
        });
    }

    onMouseDownBackground = event => {
        event.preventDefault();

        const { xExtent } = this.state;
        const range = d3ScaleRange(this.props.xScale);
        const point = this.getMousePosition(event);
        const size = xExtent[1] - xExtent[0];

        range[1] -= size;

        const min = Math.max(range[0], Math.min(range[1], point[0]));

        this.setState({ xExtent: [min, min + size] });
    };

    onMouseDownExtent = e => {
        e.preventDefault();

        this._mouseMode = MOUSE_MODE_DRAG;

        const point = this.getMousePosition(e);
        const distanceFromBorder = point[0] - this.state.xExtent[0];

        this._startPosition = distanceFromBorder;
    };

    onMouseDownResizer = (e, dir) => {
        e.preventDefault();
        this._mouseMode = MOUSE_MODE_RESIZE;
        this._resizeDir = dir;
    };

    onDrag = e => {
        const range = d3ScaleRange(this.props.xScale);
        const point = this.getMousePosition(e);

        const size = this.state.xExtent[1] - this.state.xExtent[0];

        range[1] -= size;

        const min = Math.max(
            range[0],
            Math.min(range[1], point[0] - this._startPosition)
        );

        this.setState({ xExtent: [min, min + size], xExtentDomain: null });
    };

    onResize = e => {
        const { xExtent } = this.state;
        const range = d3ScaleRange(this.props.xScale);
        const point = this.getMousePosition(e);
        // Don't let the extent go outside of its limits
        // TODO: support clamp argument of D3
        const min = Math.max(range[0], Math.min(range[1], point[0]));

        if (this._resizeDir === 'w') {
            if (min > xExtent[1]) {
                this.setState({
                    xExtent: [xExtent[1], min],
                    xExtentDomain: null
                });
                this._resizeDir = 'e';
            } else {
                this.setState({
                    xExtent: [min, xExtent[1]],
                    xExtentDomain: null
                });
            }
        } else if (this._resizeDir === 'e') {
            if (min < xExtent[0]) {
                this.setState({
                    xExtent: [min, xExtent[0]],
                    xExtentDomain: null
                });
                this._resizeDir = 'w';
            } else {
                this.setState({
                    xExtent: [xExtent[0], min],
                    xExtentDomain: null
                });
            }
        }
    };

    onMouseMove = e => {
        e.preventDefault();

        if (this._mouseMode === MOUSE_MODE_RESIZE) {
            this.onResize(e);
        } else if (this._mouseMode === MOUSE_MODE_DRAG) {
            this.onDrag(e);
        }
    };

    onMouseUp = e => {
        e.preventDefault();

        this._mouseMode = null;

        this.props.onChange(this.extent());
    };

    isEmpty = () => {
        const { xExtent, yExtent } = this.state;
        const { xScale, yScale } = this.props;

        return (
            (xScale && xExtent[0] == xExtent[1]) ||
            (yScale && yExtent[0] == yExtent[1])
        );
    };

    _extent(z, xScale) {
        const { yScale: y, xScale: x = xScale } = this.props;

        let { xExtent, yExtent, xExtentDomain, yExtentDomain } = this.state;

        let x0, x1, y0, y1, t;

        // Invert the pixel extent to data-space.
        if (!arguments.length) {
            if (x) {
                if (xExtentDomain) {
                    (x0 = xExtentDomain[0]), (x1 = xExtentDomain[1]);
                } else {
                    (x0 = xExtent[0]), (x1 = xExtent[1]);
                    if (x.invert) (x0 = x.invert(x0)), (x1 = x.invert(x1));
                    if (x1 < x0) (t = x0), (x0 = x1), (x1 = t);
                }
            }
            if (y) {
                if (yExtentDomain) {
                    (y0 = yExtentDomain[0]), (y1 = yExtentDomain[1]);
                } else {
                    (y0 = yExtent[0]), (y1 = yExtent[1]);
                    if (y.invert) (y0 = y.invert(y0)), (y1 = y.invert(y1));
                    if (y1 < y0) (t = y0), (y0 = y1), (y1 = t);
                }
            }
            return x && y ? [[x0, y0], [x1, y1]] : x ? [x0, x1] : y && [y0, y1];
        }

        // Scale the data-space extent to pixels.
        if (x) {
            (x0 = z[0]), (x1 = z[1]);
            if (y) (x0 = x0[0]), (x1 = x1[0]);
            xExtentDomain = [x0, x1];
            if (x.invert) (x0 = x(x0)), (x1 = x(x1));
            if (x1 < x0) (t = x0), (x0 = x1), (x1 = t);
            if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [x0, x1]; // copy-on-write
        }
        if (y) {
            (y0 = z[0]), (y1 = z[1]);
            if (x) (y0 = y0[1]), (y1 = y1[1]);
            yExtentDomain = [y0, y1];
            if (y.invert) (y0 = y(y0)), (y1 = y(y1));
            if (y1 < y0) (t = y0), (y0 = y1), (y1 = t);
            if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [y0, y1]; // copy-on-write
        }

        this.setState({ xExtent, yExtent, xExtentDomain, yExtentDomain });
    }
}
