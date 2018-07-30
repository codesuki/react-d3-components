import React from 'react';
import d3 from 'd3';
import { shallow } from 'enzyme';
import DataSet from './DataSet';

const defaultProps = {
    colorByLabel: false,
    groupedBars: false,
    data: [],
    colorScale: () => {},
    label: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    x: () => {},
    y0: () => {},
    y: () => {},
    values: () => {},
    xScale: () => {},
    yScale: () => {}
};

const render = props => shallow(<DataSet {...defaultProps} {...props} />);

describe('render', () => {
    const data = [
        {
            label: 'somethingA',
            values: [
                { x: 'SomethingB', y: 4 },
                { x: 'SomethingC', y: 3 },
                { x: 'SomethingD', y: -3 }
            ]
        }
    ];
    const y = e => e.y;
    const values = e => e.values;
    const xScale = d3.scale.ordinal();

    test('should render Bar', () => {
        render({ y, data, values, xScale, colorByLabel: true });
        render({ y, data, values, xScale, colorByLabel: false });
    });

    test('should render grouped Bars', () => {
        const wrap = render({
            y,
            xScale,
            values,
            data,
            groupedBars: true
        });

        expect(wrap.children().length).toBe(data[0].values.length);

        const index = 0;

        expect(wrap.childAt(index).props()).toEqual(
            expect.objectContaining({
                data: data[0].values[index],
                onMouseEnter: defaultProps.onMouseEnter,
                onMouseLeave: defaultProps.onMouseLeave
            })
        );
    });
});
