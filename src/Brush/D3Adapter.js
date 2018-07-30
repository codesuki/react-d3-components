const D3SvgBrushCursor = {
    n: 'ns-resize',
    e: 'ew-resize',
    s: 'ns-resize',
    w: 'ew-resize',
    nw: 'nwse-resize',
    ne: 'nesw-resize',
    se: 'nwse-resize',
    sw: 'nesw-resize'
};

const D3SvgBrushResizes = [
    ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'],
    ['e', 'w'],
    ['n', 's'],
    []
];

export const getD3SvgBrushResizes = index => D3SvgBrushResizes[index];

export const getD3SvgBrushCursor = key => D3SvgBrushCursor[key];
