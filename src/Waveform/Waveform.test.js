import React from 'react';
import { shallow } from 'enzyme';
import { Waveform } from './Waveform';

import DataSet from './DataSet';
import Chart from '../Chart';

const defaultProps = {
    height: 0,
    width: 0,
    margin: {},
    colorScale: () => {},
    values: () => {},
    label: () => {},
    y: () => {},
    y0: () => {},
    x: () => {},
    data: [
        {
            values: []
        }
    ],
    innerWidth: 0,
    xScale: () => {},
    yScale: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    children: 'child'
};
const render = props => shallow(<Waveform {...defaultProps} {...props} />);

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
            viewBox: `0 0 ${width} ${height}`
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
            children: defaultProps.children
        })
    );
});

test('should render DataSet with barWidth = 1', () => {
    const width = 100;
    const wrap = render({
        width,
        height: 100,
        data: [
            {
                label: '',
                values: Array(width / 2 + 1)
                    .fill(1)
                    .map((_, i) => ({ y: i, x: i }))
            }
        ]
    });

    expect(wrap.find(DataSet).prop('x0')).toBe(1);
});
