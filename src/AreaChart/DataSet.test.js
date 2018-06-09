import React from 'react';
import { shallow } from 'enzyme';
import DataSet from './DataSet';
import Path from '../Path';

const defaultProps = {
    area: () => {},
    colorScale: () => {},
    data: [],
    line: () => {},
    stroke: () => {},
    label: () => {},
    values: () => {}
};
const render = props => shallow(<DataSet {...defaultProps} {...props} />);

test('should render Paths', () => {
    const data = [{}, {}, {}];
    const tmpD = 'M0,0Z';
    const tmpFill = '#000';
    const area = () => tmpD;
    const colorScale = () => tmpFill;
    const wrap = render({
        area,
        colorScale,
        data,
        values: v => v
    });

    expect(wrap.children().length).toBe(data.length);

    expect(
        wrap
            .find(Path)
            .first()
            .props()
    ).toEqual(
        expect.objectContaining({
            className: 'area',
            d: tmpD,
            data,
            fill: tmpFill,
            stroke: 'none'
        })
    );
});
