/*
import React from 'react';
import { shallow } from 'enzyme';

import AreaChartWithHOCS from './index';

const render = props =>
    shallow(<AreaChartWithHOCS {...props} />)
        .dive()
        .dive()
        .dive()
        .dive()
        .dive()
        .dive();

describe('getTooltipHtml', () => {
    test('should ', () => {
        const data = [
            {
                label: 'somethingA',
                values: [{ x: 0, y: 0 }, { x: 1.3, y: 5 }, { x: 3, y: 6 }]
            },
            {
                label: 'somethingB',
                values: [{ x: 0, y: 3 }, { x: 1.3, y: 4 }, { x: 3, y: 7 }]
            }
        ];
        const tooltipHtml = jest.fn();

        const wrap = render({
            tooltipHtml,
            data,
            width: 400,
            height: 400,
            margin: { top: 10, bottom: 50, left: 50, right: 10 },
            interpolate: 'basis'
        });

        wrap.prop('onMouseEnter')(
            { preventDefault() {}, clientX: 1, clientY: 2 },
            data[0]
        );
        wrap.update();
        wrap.dive();

        // expect(tooltipHtml).toHaveBeenCalledTimes(1);
        // expect(tooltipHtml).toHaveBeenCalledWith(1, 2, 3, data[0].label);
    });
});
*/

test('tmp', () => {});
