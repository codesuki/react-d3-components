import React from 'react';
import PropTypes from 'prop-types';

import Path from '../Path';

const DataSet = ({ area, colorScale, data, label, values, ...props }) => {
    const areas = data.map((stack, index) =>
        <Path
            {...props}
            className="area"
            d={area(values(stack))}
            data={data}
            fill={colorScale(label(stack))}
            key={`${label(stack)}.${index}`}
            stroke="none"
        />
    );

    return <g>{areas}</g>;
};

DataSet.propTypes = {
    area: PropTypes.func.isRequired,
    colorScale: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    label: PropTypes.func.isRequired,
    line: PropTypes.func.isRequired,
    stroke: PropTypes.func.isRequired,
    values: PropTypes.func.isRequired
};

export default DataSet;
