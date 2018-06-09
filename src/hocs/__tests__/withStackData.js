import React from 'react';
import { shallow } from 'enzyme';

import { withStackData } from '../withStackData';

const AnyComponent = () => null;

const AnyComponentWithDefaultProps = withStackData(AnyComponent);

const render = ({
    data = null,
    values = stack => stack.values,
    x = e => e.x,
    y = e => e.y,
    y0 = e => e.y0,
    ...props
}) =>
    shallow(
        <AnyComponentWithDefaultProps
            {...props}
            data={data}
            values={values}
            x={x}
            y={y}
            y0={y0}
        />
    );

test('should provide Stack data', () => {
    const data = [
        {
            label: 'somethingA',
            values: [
                { x: 0, y: 0 },
                { x: 1.3, y: 5 },
                { x: 3, y: -6 },
                { x: 3.5, y: -6.5 },
                { x: 4, y: 6 },
                { x: 4.5, y: 6 },
                { x: 5, y: 7 },
                { x: 5.5, y: 8 }
            ]
        }
    ];

    const wrap = render({ data });

    expect(wrap.prop('data')).toEqual([
        {
            label: 'somethingA',
            values: [
                { x: 0, y: 0, y0: 0 },
                { x: 1.3, y: 5, y0: 0 },
                { x: 3, y: -6, y0: 0 },
                { x: 3.5, y: -6.5, y0: 0 },
                { x: 4, y: 6, y0: 0 },
                { x: 4.5, y: 6, y0: 0 },
                { x: 5, y: 7, y0: 0 },
                { x: 5.5, y: 8, y0: 0 }
            ]
        }
    ]);
});
