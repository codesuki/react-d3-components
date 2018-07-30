import React from 'react';
import { shallow } from 'enzyme';

import { Brush } from './Brush';

const defaultProps = {};

const render = props => shallow(<Brush {...defaultProps} {...props} />);

test('should render correctly', () => {
    render();
});
//
//
// <Brush
//     width={400}
//     height={50}
//     margin={{top: 0, bottom: 30, left: 50, right: 20}}
//     xScale={this.state.xScaleBrush}
//     extent={[new Date(2015, 2, 10), new Date(2015, 2, 12)]}
//     onChange={this._onChange}
//     xAxis={{
//         tickValues: this.state.xScaleBrush.ticks(d3.time.day, 2),
//         tickFormat: d3.time.format("%m/%d")
//     }}
// />
