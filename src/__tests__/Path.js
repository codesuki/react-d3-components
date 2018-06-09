import React from 'react';
import { shallow } from 'enzyme';
import Path from '../Path';

const render = ({
    className = '',
    d = '',
    data = [],
    fill = '',
    stroke = '',
    strokeDasharray = '',
    strokeLinecap = '',
    strokeWidth = '',
    onMouseLeave = () => {},
    onMouseEnter = () => {},
    ...props
}) =>
    shallow(
        <Path
            className={className}
            d={d}
            data={data}
            fill={fill}
            stroke={stroke}
            strokeDasharray={strokeDasharray}
            strokeLinecap={strokeLinecap}
            strokeWidth={strokeWidth}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
            {...props}
        />
    );

test('should render', () => {
    const className = 'className';
    const d = 'd';
    const fill = 'fill';
    const stroke = 'stroke';
    const strokeDasharray = 'strokeDasharray';
    const strokeLinecap = 'strokeLinecap';
    const strokeWidth = 'strokeWidth';

    const wrap = render({
        className,
        d,
        fill,
        stroke,
        strokeDasharray,
        strokeLinecap,
        strokeWidth
    });

    expect(wrap.props()).toEqual(
        expect.objectContaining({
            className,
            d,
            fill,
            stroke,
            strokeDasharray,
            strokeLinecap,
            strokeWidth
        })
    );
});

test('should call default handlers', () => {
    const wrap = render({ onMouseEnter: void 0, onMouseLeave: void 0 });
    wrap.props().onMouseMove();
});

test('should call onMouseMove with data', () => {
    const data = ['data'];
    const event = {};
    const onMouseEnter = jest.fn();
    const wrap = render({ data, onMouseEnter });

    expect(onMouseEnter).toHaveBeenCalledTimes(0);
    wrap.props().onMouseMove(event);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseEnter).toHaveBeenCalledWith(event, data);
});
