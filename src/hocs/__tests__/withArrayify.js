import React from 'react';
import { shallow } from 'enzyme';
import { withArrayify, defaultData } from '../withArrayify';

const AnyComponent = () => null;
const AnyComponentWithDefaultProps = withArrayify(AnyComponent);
const render = ({ data = null, ...props }) =>
    shallow(<AnyComponentWithDefaultProps {...props} data={data} />);

test('should provide default data', () => {
    const wrap = render({});

    expect(wrap.find(AnyComponent).prop('data')).toEqual([defaultData]);
});

describe('arrayify', () => {
    test("should transform data to array when isn't array", () => {
        const data = {
            label: '',
            values: []
        };
        const wrap = render({ data });

        expect(wrap.find(AnyComponent).prop('data')).toEqual([data]);
    });

    test('should not change the data property when data is array', () => {
        const data = [
            {
                label: '',
                values: []
            }
        ];
        const wrap = render({ data });

        expect(wrap.find(AnyComponent).prop('data')).toBe(data);
    });
});
