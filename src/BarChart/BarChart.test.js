import React from 'react';
import { shallow } from 'enzyme';
import { BarChart } from './BarChart';

import DataSet from './DataSet';
import Chart from '../Chart';
import Axis from '../Axis';

const defaultProps = {
    xAxis: () => {},
    yAxis: () => {},
    height: 0,
    width: 0,
    margin: {},
    viewBox: '0 0 1 1',
    preserveAspectRatio: () => {},
    colorScale: () => {},
    values: () => {},
    label: () => {},
    y: () => {},
    y0: () => {},
    x: () => {},
    groupedBars: false,
    colorByLabel: false,
    tickFormat: () => {},
    data: [],
    innerWidth: 0,
    innerHeight: 0,
    xScale: () => {},
    yScale: () => {},
    yIntercept: () => {},
    svgRoot: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    children: null,
    renderTooltip: () => {}
};
const render = props => shallow(<BarChart {...defaultProps} {...props} />);

test('should render', () => {
    const [width, height] = [12, 32];
    const wrap = render({
        width,
        height
    });

    expect(wrap.find(Chart).props()).toEqual(
        expect.objectContaining({
            height,
            width,
            margin: defaultProps.margin,
            viewBox: defaultProps.viewBox
        })
    );

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
            y0: defaultProps.y0,
            onMouseEnter: defaultProps.onMouseEnter,
            onMouseLeave: defaultProps.onMouseLeave,
            colorByLabel: defaultProps.colorByLabel,
            groupedBars: defaultProps.groupedBars
        })
    );

    expect(wrap.find(Axis).get(0).props).toEqual(
        expect.objectContaining({
            className: 'x axis',
            orientation: 'bottom',
            scale: defaultProps.xScale,
            height: defaultProps.innerHeight,
            width: defaultProps.innerWidth,
            zero: defaultProps.yIntercept,
            tickFormat: defaultProps.tickFormat
        })
    );
    expect(wrap.find(Axis).get(1).props).toEqual(
        expect.objectContaining({
            className: 'y axis',
            orientation: 'left',
            scale: defaultProps.yScale,
            height: defaultProps.innerHeight,
            width: defaultProps.innerWidth,
            tickFormat: defaultProps.tickFormat
        })
    );
});

test('renderTooltip', () => {
    const yScale = () => {};
    const xScale = () => {};
    const d = { x: 1, y: 2, y0: 0 };
    const data = [{ values: [{}, d] }];
    const x = e => e.x;
    const y = e => e.y;
    const y0 = e => e.y0;
    xScale.rangeBand = () => 2;
    render({
        yScale,
        xScale,
        data,
        x,
        y,
        y0,
        tooltipHtml: () => '',
        renderTooltip: fn => fn(d)
    });
});
