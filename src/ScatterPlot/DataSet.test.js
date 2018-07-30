import React from 'react';
import { shallow } from 'enzyme';
import DataSet from './DataSet';

const dProps = {
    data: [],
    symbol: () => {},
    xScale: () => {},
    yScale: () => {},
    colorScale: () => {},
    label: () => {},
    values: () => {},
    x: () => {},
    y: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {}
};
const render = props => shallow(<DataSet {...dProps} {...props} />);

test('should render Paths', () => {
    const data = [{}, {}, {}];
    const wrap = render({
        values: () => [{}],
        data
    });
    expect(wrap.children().length).toBe(data.length);
});

test('should render Paths', () => {
    const onMouseEnter = jest.fn();
    const data = [{}];
    const wrap = render({
        values: () => [{}],
        data,
        onMouseEnter
    });
    const event = {};

    expect(onMouseEnter).toHaveBeenCalledTimes(0);

    wrap
        .children()
        .first()
        .dive()
        .prop('onMouseOver')(event);

    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseEnter).toHaveBeenCalledWith(event, data[0]);
});
