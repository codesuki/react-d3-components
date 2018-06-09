import React from 'react';
import { shallow } from 'enzyme';

import Resizer from './Resizer';

const defaultProps = {
    resizeType: '',
    cursor: '',
    xExtent: [],
    yExtent: [],
    onMouseDown: () => {},
    empty: () => {},
    innerHeight: 0
};

const render = props => shallow(<Resizer {...defaultProps} {...props} />);

test('should render correctly', () => {
    render();
});

test('should call onMouseDown with data and event', () => {
    const onMouseDown = jest.fn();
    const resizeType = 'resizeType';
    const wrap = render({
        onMouseDown,
        resizeType
    });

    const event = { target: {} };

    expect(onMouseDown).toHaveBeenCalledTimes(0);

    wrap.prop('onMouseDown')(event);

    expect(onMouseDown).toHaveBeenCalledTimes(1);
    expect(onMouseDown).toHaveBeenCalledWith(event, resizeType);
});

test('should hide rect when empty return true', () => {
    expect(
        render({ empty: () => true })
            .find('rect')
            .prop('style').display
    ).toBe('none');

    expect(
        render()
            .find('rect')
            .prop('style').display
    ).toBeFalsy();
});

test('should set x -3 when resizeType is ending of east or west', () => {
    expect(
        render({ resizeType: 'w' })
            .find('rect')
            .prop('x')
    ).toBe(-3);
    expect(
        render({ resizeType: 'e' })
            .find('rect')
            .prop('x')
    ).toBe(-3);
});

test('should set y -3 when resizeType is starting of south or north', () => {
    expect(
        render({ resizeType: 's' })
            .find('rect')
            .prop('y')
    ).toBe(-3);
    expect(
        render({ resizeType: 'n' })
            .find('rect')
            .prop('y')
    ).toBe(-3);
});
