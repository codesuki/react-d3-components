import React from 'react';
import { shallow } from 'enzyme';
import DataSet from './DataSet';
import Path from '../Path';

const defaultProps = {
    data: [],
    line: () => {},
    colorScale: () => {},

    label: e => e.label,
    values: e => e.values
};

const render = props => shallow(<DataSet {...defaultProps} {...props} />);

describe('render', () => {
    test('', () => {
        render();
    });

    test('renderLabel', () => {
        const outerArc = () => {};
        const arc = () => {};
        outerArc.centroid = () => [{}];
        arc.centroid = () => [{}];

        render({
            outerArc,
            arc,
            hideLabels: false,
            pie: [
                {
                    endAngle: 0.5,
                    startAngle: 0.2,
                    value: 12
                }
            ]
        });
    });
});

test('should call onMouseEnter with data', () => {
    const onMouseEnter = jest.fn();
    const data = [1];
    const wrap = render({
        onMouseEnter,
        data
    });

    const event = { target: {} };

    expect(onMouseEnter).toHaveBeenCalledTimes(0);
    wrap.find('rect[style]').prop('onMouseMove')(event);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseEnter).toHaveBeenCalledWith(event, data);
});

test('should call onMouseEnter with data', () => {
    const onMouseEnter = jest.fn();
    const data = [1];
    const wrap = render({
        onMouseEnter,
        data
    });

    const event = { target: {} };

    expect(onMouseEnter).toHaveBeenCalledTimes(0);
    wrap.find('rect[style]').prop('onMouseMove')(event);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseEnter).toHaveBeenCalledWith(event, data);
});

test('should use custom stroke styles', () => {
    const [w, l, d] = [2, 'square', '4 1'];
    const strokeWidth = jest.fn().mockReturnValue(w);
    const strokeLinecap = jest.fn().mockReturnValue(l);
    const strokeDasharray = jest.fn().mockReturnValue(d);

    expect(strokeWidth).toHaveBeenCalledTimes(0);
    expect(strokeLinecap).toHaveBeenCalledTimes(0);
    expect(strokeDasharray).toHaveBeenCalledTimes(0);

    const label = '123';
    const data = [
        {
            label
        }
    ];
    const wrap = render({
        strokeWidth,
        strokeLinecap,
        strokeDasharray,
        label: e => e.label,
        data
    });

    expect(strokeWidth).toHaveBeenCalledTimes(data.length);
    expect(strokeLinecap).toHaveBeenCalledTimes(data.length);
    expect(strokeDasharray).toHaveBeenCalledTimes(data.length);

    expect(wrap.find(Path).props()).toEqual(
        expect.objectContaining({
            strokeWidth: w,
            strokeLinecap: l,
            strokeDasharray: d
        })
    );
});
