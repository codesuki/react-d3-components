export const d3ScaleExtent = domain => {
    const start = domain[0];
    const stop = domain[domain.length - 1];
    return start < stop ? [start, stop] : [stop, start];
};

export const d3ScaleRange = scale =>
    scale.rangeExtent ? scale.rangeExtent() : d3ScaleExtent(scale.range());
