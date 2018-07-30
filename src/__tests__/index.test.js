import * as ReactD3 from '../index';

test('should provide components', () => {
    expect(ReactD3).toEqual({
        AreaChart: expect.any(Function),
        BarChart: expect.any(Function),
        Brush: expect.any(Function),
        LineChart: expect.any(Function),
        PieChart: expect.any(Function),
        ScatterPlot: expect.any(Function),
        Waveform: expect.any(Function)
    });
});
