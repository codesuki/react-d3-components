import React from 'react';
import { shallow } from 'enzyme';
import { withAccessor, defaultProps } from '../withAccessor';

const AnyComponent = () => null;
const AnyComponentWithDefaultProps = withAccessor(AnyComponent);
const render = props => shallow(<AnyComponentWithDefaultProps {...props} />);

test('should provide default props', () => {
    const wrap = render({});

    expect(wrap.find(AnyComponent).props()).toEqual(defaultProps);
});

test('should call getters', () => {
    const wrap = render({});
    const [values, label] = [[1, 2], 'label'];
    const [x, y] = [1, 2];
    const stack = {
        label,
        values
    };
    const e = {
        x,
        y
    };

    const component = wrap.find(AnyComponent);

    expect(component.prop('label')(stack)).toBe(label);
    expect(component.prop('values')(stack)).toBe(values);
    expect(component.prop('x')(e)).toBe(x);
    expect(component.prop('y')(e)).toBe(y);
    expect(component.prop('y0')()).toBe(0);
});
