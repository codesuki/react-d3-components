import React from 'react';
import { shallow } from 'enzyme';
import { withDefaultProps, defaultProps } from '../withDefaultProps';

const AnyComponent = () => null;
const AnyComponentWithDefaultProps = withDefaultProps(AnyComponent);
const render = props => shallow(<AnyComponentWithDefaultProps {...props} />);

test('should provide default props', () => {
    const myProps = {
        height: 100,
        width: 100
    };
    const wrap = render(myProps);

    expect(wrap.find(AnyComponent).props()).toEqual({
        ...defaultProps,
        ...myProps
    });
});
