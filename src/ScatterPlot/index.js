import { compose } from '../utils/compose';
import { ScatterPlot } from './ScatterPlot';
import { withAccessor } from '../hocs/withAccessor';
import { withArrayify } from '../hocs/withArrayify';
import { withDefaultProps } from '../hocs/withDefaultProps';
import { withDefaultScales } from '../hocs/withDefaultScales';
import { withHeightWidth } from '../hocs/withHeightWidth';
import { withTooltip } from '../hocs/withTooltip';

export default compose(
    withDefaultProps,
    withHeightWidth,
    withArrayify,
    withAccessor,
    withDefaultScales,
    withTooltip
)(ScatterPlot);
