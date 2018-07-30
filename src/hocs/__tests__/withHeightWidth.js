import React from 'react';
import { shallow } from 'enzyme';
import { withHeightWidth } from '../withHeightWidth';

const AnyComponent = () => null;
const AnyComponentWithDefaultProps = withHeightWidth(AnyComponent);
const render = ({ data = null, ...props }) =>
    shallow(<AnyComponentWithDefaultProps {...props} data={data} />);

test('should provide innerHeight and innerWidth properties', () => {
    const [top, left, right, bottom] = [10, 10, 20, 20];
    const [width, height] = [100, 100];
    const wrap = render({
        width,
        height,
        margin: {
            top,
            left,
            right,
            bottom
        }
    });

    expect(wrap.find(AnyComponent).prop('innerWidth')).toEqual(70);
    expect(wrap.find(AnyComponent).prop('innerHeight')).toEqual(70);
});
