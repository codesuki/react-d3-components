import React from 'react';
import { shallow } from 'enzyme';
import DataSet from './DataSet';

const defaultProps = {
    data: [],
    xScale: () => {},
    yScale: () => {},
    colorScale: () => {},
    values: () => {},
    label: () => {},
    x: () => {},
    y: () => {},
    y0: () => {},
    width: 0,
    fill: ''
};
const render = ({ ...props }) =>
    shallow(<DataSet {...defaultProps} {...props} />);

test('should render Bars', () => {
    const data = [{}, {}, {}];
    const yScale = () => {};

    yScale.domain = () => [{}];

    const wrap = render({
        values: () => [{}],
        data,
        yScale
    });

    expect(wrap.children().length).toBe(data.length);
});
