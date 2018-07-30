import React from 'react';
import { shallow } from 'enzyme';
import Bar from '../Bar';

const defaultProps = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    fill: '',
    data: [],
    onMouseEnter: () => {},
    onMouseLeave: () => {}
};

const render = props => shallow(<Bar {...defaultProps} {...props} />);

test('should render', () => {
    expect(render().props()).toEqual(
        expect.objectContaining({
            className: 'bar',
            x: defaultProps.x,
            y: defaultProps.y,
            width: defaultProps.width,
            height: defaultProps.height,
            fill: defaultProps.fill,
            onMouseLeave: defaultProps.onMouseLeave
        })
    );
});

test('should call onMouseEnter with event and data', () => {
    const event = {};
    const data = ['any data'];
    const onMouseEnter = jest.fn();
    const wrap = render({
        data,
        onMouseEnter
    });

    expect(onMouseEnter).toHaveBeenCalledTimes(0);

    wrap.prop('onMouseMove')(event);

    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseEnter).toHaveBeenCalledWith(event, data);
});
