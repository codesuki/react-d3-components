import React from 'react';
import { shallow } from 'enzyme';
import Wedge from './Wedge';

const defaultProps = {
    d: '',
    fill: '',
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    data: {}
};

const render = props => shallow(<Wedge {...defaultProps} {...props} />);

test('should render path', () => {
    const d = 'ddd';
    const fill = 'fff';
    const wrap = render({ d, fill });

    expect(wrap.props()).toEqual(
        expect.objectContaining({
            d,
            fill,
            onMouseLeave: defaultProps.onMouseLeave
        })
    );
});

test('should call onMouseEnter with data argument', () => {
    const onMouseEnter = jest.fn();
    const data = {};
    const event = {};
    const wrap = render({
        onMouseEnter,
        data
    });

    expect(onMouseEnter).toHaveBeenCalledTimes(0);

    wrap.prop('onMouseMove')(event);

    expect(onMouseEnter).toHaveBeenCalledTimes(1    );
    expect(onMouseEnter).toHaveBeenCalledWith(event, data);
});
