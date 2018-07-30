import React from 'react';
import { shallow } from 'enzyme';

import { LineChart } from './LineChart';

const defaultProps = {
    renderTooltip: () => {},
    tooltipHidden: true,
};

const render = props => shallow(<LineChart {...defaultProps} {...props} />);

test('should render correctly', () => {
    render();
});
