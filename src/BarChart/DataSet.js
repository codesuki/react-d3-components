import React from 'react';
import PropTypes from 'prop-types';

import Bar from '../Bar';

const DataSet = ({
    data,
    xScale,
    yScale,
    colorScale,
    values,
    label,
    x,
    y,
    y0,
    onMouseEnter,
    onMouseLeave,
    groupedBars,
    colorByLabel
}) => {
    let bars;
    if (groupedBars) {
        bars = data.map((stack, serieIndex) =>
            values(stack).map((e, index) => {
                const yVal = y(e) < 0 ? yScale(0) : yScale(y(e));
                return (
                    <Bar
                        key={`${label(stack)}.${index}`}
                        width={xScale.rangeBand() / data.length}
                        height={Math.abs(yScale(0) - yScale(y(e)))}
                        x={
                            xScale(x(e)) +
                            xScale.rangeBand() * serieIndex / data.length
                        }
                        y={yVal}
                        fill={colorScale(label(stack))}
                        data={e}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                );
            })
        );
    } else {
        bars = data.map(stack =>
            values(stack).map((e, index) => {
                const color = colorByLabel
                    ? colorScale(label(stack))
                    : colorScale(x(e));
                const yVal = y(e) < 0 ? yScale(y0(e)) : yScale(y0(e) + y(e));
                return (
                    <Bar
                        key={`${label(stack)}.${index}`}
                        width={xScale.rangeBand()}
                        height={Math.abs(yScale(y0(e) + y(e)) - yScale(y0(e)))}
                        x={xScale(x(e))}
                        y={yVal}
                        fill={color}
                        data={e}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                );
            })
        );
    }

    return <g>{bars}</g>;
};

DataSet.propTypes = {
    colorByLabel: PropTypes.bool,
    groupedBars: PropTypes.bool,
    data: PropTypes.array.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    colorScale: PropTypes.func.isRequired,
    values: PropTypes.func.isRequired,
    label: PropTypes.func.isRequired,
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
    y0: PropTypes.func.isRequired
};

export default DataSet;
