import React from 'react';
import { shallow } from 'enzyme';

import Axis from '../Axis';
import Chart from '../Chart';
import DataSet from './DataSet';
import { AreaChart } from './AreaChart';

const defaultProps = {
    children: '',
    colorScale: () => {},
    data: [],
    height: 0,
    innerHeight: 0,
    innerWidth: 0,
    label: () => {},
    margin: {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    preserveAspectRatio: 'none',
    renderTooltip: () => {},
    stroke: () => {},
    svgRoot: () => {},
    values: () => {},
    viewBox: '0 0 1 1',
    width: 0,
    x: () => {},
    xAxis: () => {},
    xScale: () => {},
    y0: () => {},
    y: () => {},
    yAxis: () => {},
    yOrientation: '',
    yScale: () => {}
};
const render = props => shallow(<AreaChart {...defaultProps} {...props} />);

describe('render', () => {
    test('should render Chart', () => {
        const wrap = render();

        expect(wrap.find(Chart).props()).toEqual(
            expect.objectContaining({
                height: defaultProps.height,
                width: defaultProps.width,
                margin: defaultProps.margin,
                viewBox: defaultProps.viewBox,
                svgRoot: defaultProps.svgRoot,
                preserveAspectRatio: defaultProps.preserveAspectRatio
            })
        );
    });

    test('should render DataSet', () => {
        const wrap = render();

        expect(wrap.find(DataSet).props()).toEqual(
            expect.objectContaining({
                data: defaultProps.data,
                colorScale: defaultProps.colorScale,
                stroke: defaultProps.stroke,
                label: defaultProps.label,
                values: defaultProps.values,
                onMouseEnter: defaultProps.onMouseEnter,
                onMouseLeave: defaultProps.onMouseLeave
            })
        );
    });

    test('should render Axis', () => {
        const wrap = render();

        expect(wrap.find(Axis).get(0).props).toEqual(
            expect.objectContaining({
                className: 'x axis',
                orientation: 'bottom',
                scale: defaultProps.xScale,
                height: defaultProps.innerHeight,
                width: defaultProps.innerWidth
            })
        );

        expect(wrap.find(Axis).get(1).props).toEqual(
            expect.objectContaining({
                className: 'y axis',
                orientation: 'left',
                scale: defaultProps.yScale,
                height: defaultProps.innerHeight,
                width: defaultProps.innerWidth
            })
        );
    });

    test('should render Y Axis with custom orientation', () => {
        const yOrientation = 'right';
        const wrap = render({
            yOrientation
        });

        expect(wrap.find(Axis).get(1).props.orientation).toBe(yOrientation);
    });
});
