import { getPositionBySvgAndEvent } from '../get-position';

test('should return position when svg element has method createSVGPoint', () => {
    const x = 196;
    const y = 239;
    const createSVGPoint = jest.fn().mockReturnValue({
        matrixTransform: () => ({ x, y })
    });
    const svg = {
        createSVGPoint,
        getScreenCTM: () => ({
            inverse: () => {}
        })
    };
    const clientX = 100;
    const clientY = 120;
    const margin = { top: 50, left: 30 };
    const result = getPositionBySvgAndEvent({
        svg,
        clientY,
        clientX,
        margin
    });

    expect(result).toEqual([x - margin.left, y - margin.top]);
});
