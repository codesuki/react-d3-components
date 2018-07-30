import { compose } from '../utils/compose';
import { withArrayify } from '../hocs/withArrayify';
import { withDefaultProps } from '../hocs/withDefaultProps';
import { withDefaultScales } from '../hocs/withDefaultScales';
import { withHeightWidth } from '../hocs/withHeightWidth';
import { withStackAccessor } from '../hocs/withStackAccessor';
import { withStackData } from '../hocs/withStackData';
import { withTooltip } from '../hocs/withTooltip';
import { AreaChart } from './AreaChart';

export default compose(
    withDefaultProps,
    withHeightWidth,
    withArrayify,
    withStackAccessor,
    withStackData,
    withDefaultScales,
    withTooltip
)(AreaChart);
