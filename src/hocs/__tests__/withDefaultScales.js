import React from 'react';
import d3 from 'd3';
import { shallow } from 'enzyme';

import { compose } from '../../utils/compose';
import { withDefaultScales } from '../withDefaultScales';
import { withStackAccessor } from '../withStackAccessor';
import { withStackData } from '../withStackData';

const AnyComponent = () => null;
const AnyComponentWithDefaultProps = compose(
    withStackAccessor,
    withStackData,
    withDefaultScales
)(AnyComponent);

const render = ({
    data = [
        {
            label: '',
            values: []
        }
    ],
    innerHeight = 100,
    innerWidth = 100,
    ...props
}) =>
    shallow(
        <AnyComponentWithDefaultProps
            data={data}
            innerHeight={innerHeight}
            innerWidth={innerWidth}
            {...props}
        />
    );

const getAnyComponent = wrap => wrap.dive().dive();
const getValues = wrap => {
    const props = getAnyComponent(wrap).props();

    return props.data[0].values.map(val => ({
        x: props.xScale(props.x(val)),
        y: props.yScale(props.y(val))
    }));
};

test('should provide custom scales', () => {
    const xScale = d3.time.scale().range([0, 100]);
    const yScale = d3.time.scale().range([0, 100]);

    expect(
        getAnyComponent(
            render({
                xScale,
                yScale
            })
        ).props()
    ).toEqual(
        expect.objectContaining({
            xScale,
            yScale
        })
    );
});

test('should provide Linear Scales', () => {
    const wrap = render({
        data: [
            {
                label: 'somethingA',
                values: [
                    { x: 0, y: 0 },
                    { x: 1.3, y: 5 },
                    { x: 3, y: 6 },
                    { x: 3.5, y: 6.5 },
                    { x: 4, y: 6 },
                    { x: 4.5, y: 6 },
                    { x: 5, y: 7 },
                    { x: 5.5, y: 8 }
                ]
            }
        ]
    });

    expect(getValues(wrap)).toEqual([
        { x: 0, y: 100 },
        { x: 23.636363636363637, y: 37.5 },
        { x: 54.54545454545454, y: 25 },
        { x: 63.63636363636363, y: 18.75 },
        { x: 72.72727272727273, y: 25 },
        { x: 81.81818181818183, y: 25 },
        { x: 90.9090909090909, y: 12.5 },
        { x: 100, y: 0 }
    ]);
});

test('should provide Ordinal X Scales', () => {
    const wrap = render({
        data: [
            {
                label: 'somethingA',
                values: [
                    { x: 'SomethingA', y: 10 },
                    { x: 'SomethingB', y: 4 },
                    { x: 'SomethingC', y: 3 },
                    { x: 'SomethingD', y: -3 }
                ]
            }
        ]
    });

    expect(getValues(wrap)).toEqual([
        { x: 12, y: 0 },
        { x: 34, y: 46.15384615384615 },
        { x: 56, y: 53.84615384615385 },
        { x: 78, y: 100 }
    ]);
});

test('should provide Ordinal Y Scales', () => {
    const wrap = render({
        data: [
            {
                label: 'somethingA',
                values: [
                    { y: 'SomethingA', x: 10 },
                    { y: 'SomethingB', x: 4 },
                    { y: 'SomethingC', x: 3 },
                    { y: 'SomethingD', x: -3 }
                ]
            }
        ]
    });

    expect(getValues(wrap)).toEqual([
        { x: 100, y: 0 },
        { x: 53.84615384615385, y: 100 },
        { x: 46.15384615384615, y: 0 },
        { x: 0, y: 100 }
    ]);
});

test('should provide Time Scales', () => {
    const wrap = render({
        data: [
            {
                label: 'somethingA',
                values: [
                    { x: new Date(2015, 2, 5), y: 1 },
                    { x: new Date(2015, 2, 6), y: 2 },
                    { x: new Date(2015, 2, 7), y: 0 },
                    { x: new Date(2015, 2, 8), y: 3 }
                ]
            }
        ]
    });

    expect(getValues(wrap)).toEqual([
        { x: 0, y: 66.66666666666667 },
        { x: 33.33333333333333, y: 33.333333333333336 },
        { x: 66.66666666666666, y: 100 },
        { x: 100, y: 0 }
    ]);
});

test('groupedBars', () => {
    const wrap = render({
        groupedBars: true,
        data: [
            {
                label: 'somethingA',
                values: [
                    { x: 'SomethingA', y: 10 },
                    { x: 'SomethingB', y: 4 },
                    { x: 'SomethingC', y: -3 }
                ]
            },
            {
                label: 'somethingB',
                values: [
                    { x: 'SomethingA', y: 5 },
                    { x: 'SomethingB', y: 8 },
                    { x: 'SomethingC', y: -5 }
                ]
            }
        ]
    });

    expect(getValues(wrap)).toEqual([
        { x: 15, y: 0 },
        { x: 43, y: 40 },
        { x: 71, y: 86.66666666666667 }
    ]);
});
