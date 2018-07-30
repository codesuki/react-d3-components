import React from 'react';
import { shallow } from 'enzyme';
import { PieChart } from './PieChart';

const defaultProps = {
    innerRadius: 0,
    outerRadius: 0,
    labelRadius: 0,
    padRadius: '',
    sort: undefined,
    hideLabels: false,
    values: () => {},
    renderTooltip: () => {},
    margin: {},
    width: 0
};

const render = props => shallow(<PieChart {...defaultProps} {...props} />);

describe('render', () => {
    test('should render', () => {
        render({
            values: () => []
        });
    });

    test('should use custom sort', () => {
        const sort = (a, b) => a.x.localeCompare(b.x);

        const wrap = render({
            sort,
            y: e => e.y,
            values: e => e.values,
            data: {
                label: 'somethingA',
                values: [
                    { x: 'я', y: 10 },
                    { x: 'ё', y: 2 },
                    { x: 'б', y: 3 },
                    { x: 'л', y: 4 },
                    { x: 'э', y: 9 },
                    { x: 'ъ', y: 1 }
                ]
            }
        });
    });
});
