import React from 'react';
import { shallow } from 'enzyme';
import DataSet from './DataSet';

const defaultProps = {
    pie: [],
    arc: () => {},
    outerArc: () => {},
    colorScale: () => {},
    radius: 0,
    strokeWidth: 0,
    stroke: '',
    fill: '',
    opacity: 0,
    x: () => {},
    y: () => {},
    hideLabels: false
};

const render = props => shallow(<DataSet {...defaultProps} {...props} />);

describe('render', () => {
    test('', () => {
        render({
            pie: [
                {
                    endAngle: 0.5,
                    startAngle: 0.2,
                    data: {}
                }
            ]
        });
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
