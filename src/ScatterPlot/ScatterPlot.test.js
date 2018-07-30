import React from 'react';
import { shallow } from 'enzyme';
import { ScatterPlot } from './ScatterPlot';
import Axis from '../Axis';
import Chart from '../Chart';
import DataSet from './DataSet';

const defaultProps = {
    height: 0,
    width: 0,
    margin: {},
    viewBox: () => {},
    preserveAspectRatio: '',
    colorScale: () => {},
    rScale: () => {},
    shape: '',
    label: () => {},
    values: () => {},
    x: () => {},
    y: () => {},
    xAxis: () => {},
    yAxis: () => {},
    data: [],
    innerWidth: 0,
    innerHeight: 0,
    xScale: () => {},
    yScale: () => {},
    xIntercept: 0,
    yIntercept: 0,
    svgRoot: () => {},
    renderTooltip: () => {}
};
const render = props => shallow(<ScatterPlot {...defaultProps} {...props} />);

test('should render Chart', () => {
    const height = 32;
    const width = 12;
    const wrap = render({
        height,
        width
    });

    expect(wrap.find(Chart).props()).toEqual(
        expect.objectContaining({
            height,
            width,
            margin: defaultProps.margin,
            viewBox: defaultProps.viewBox,
            preserveAspectRatio: defaultProps.preserveAspectRatio,
            svgRoot: defaultProps.svgRoot
        })
    );
});

test('should render Axis', () => {
    const innerHeight = 32;
    const innerWidth = 12;
    const wrap = render({
        innerHeight,
        innerWidth
    });

    expect(wrap.find(Axis).get(0).props).toEqual(
        expect.objectContaining({
            className: 'x axis',
            orientation: 'bottom',
            scale: defaultProps.xScale,
            height: innerHeight,
            width: innerWidth,
            zero: defaultProps.yIntercept
        })
    );

    expect(wrap.find(Axis).get(1).props).toEqual(
        expect.objectContaining({
            className: 'y axis',
            orientation: 'left',
            scale: defaultProps.yScale,
            height: innerHeight,
            width: innerWidth,
            zero: defaultProps.xIntercept
        })
    );
});

test('should render DataSet', () => {
    const wrap = render();

    expect(wrap.find(DataSet).props()).toEqual(
        expect.objectContaining({
            data: defaultProps.data,
            xScale: defaultProps.xScale,
            yScale: defaultProps.yScale,
            colorScale: defaultProps.colorScale,
            label: defaultProps.label,
            values: defaultProps.values,
            x: defaultProps.x,
            y: defaultProps.y,
            onMouseEnter: defaultProps.onMouseEnter,
            onMouseLeave: defaultProps.onMouseLeave
        })
    );
});

test('should use custom size in symbol', () => {
    const rScale = null;
    const wrap = render({
        rScale
    });

    expect(
        wrap
            .find(DataSet)
            .prop('symbol')
            .size()
    ).not.toBe(rScale);

    const MyrScale = () => {};
    const wrap2 = render({
        rScale: MyrScale
    });

    expect(
        wrap2
            .find(DataSet)
            .prop('symbol')
            .size()
    ).toBe(MyrScale);
});

test('should call getTooltipHtml', () => {
    const tooltipHtml = jest.fn();
    const [x, y] = [12, 31];
    const data = { x, y };

    render({
        tooltipHtml,
        renderTooltip: fn => {
            fn(data);
        }
    });

    expect(tooltipHtml).toHaveBeenCalledTimes(1);
});
