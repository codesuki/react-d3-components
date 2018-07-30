import { compose } from '../utils/compose';
import { PieChart } from './PieChart';
import { withAccessor } from '../hocs/withAccessor';
import { withDefaultProps } from '../hocs/withDefaultProps';
import { withHeightWidth } from '../hocs/withHeightWidth';
import { withTooltip } from '../hocs/withTooltip';

export default compose(
    withDefaultProps,
    withHeightWidth,
    withAccessor,
    withTooltip
)(PieChart);
