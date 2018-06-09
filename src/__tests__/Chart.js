import React from 'react';
import { shallow } from 'enzyme';
import Chart from '../Chart';

const render = ({
    width = 0,
    height = 0,
    viewBox = '',
    preserveAspectRatio = 1,
    margin = { top: 0, left: 0 },
    ...props
}) =>
    shallow(
        <Chart
            width={width}
            height={height}
            viewBox={viewBox}
            preserveAspectRatio={preserveAspectRatio}
            margin={margin}
            {...props}
        />
    );

test('should render', () => {
    const width = 100;
    const height = 100;
    const viewBox = '0 0 50 50';
    const preserveAspectRatio = 2;
    const margin = { top: 12, left: 13 };

    const wrap = render({
        width,
        height,
        viewBox,
        preserveAspectRatio,
        margin
    });

    expect(wrap.props()).toEqual(
        expect.objectContaining({
            width,
            height,
            viewBox,
            preserveAspectRatio
        })
    );
    expect(wrap.childAt(0).props().transform).toBe(
        `translate(${margin.left}, ${margin.top})`
    );
});
