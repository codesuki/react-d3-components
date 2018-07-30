import React from 'react';
import { mount, shallow } from 'enzyme';
import { withTooltip } from '../withTooltip';

const AnyComponent = ({ svgRoot }) => <svg ref={svgRoot} />;

const AnyComponentWithDefaultProps = withTooltip(AnyComponent);

const renderTooltip = (wrap, ...args) => {
    const { renderTooltip } = wrap.find(AnyComponent).props();

    return shallow(renderTooltip(...args));
};
const render = ({
    data = null,
    margin = { top: 0, bottom: 0, left: 0, right: 0 },
    ...props
}) =>
    mount(
        <AnyComponentWithDefaultProps {...props} margin={margin} data={data} />
    );

const monkeyPath = (wrap, fn) => {
    wrap.find('svg').getElement().ref.current.getBoundingClientRect = fn;
};

describe('onMouseEnter onMouseLeave', () => {
    const clientX = 31;
    const clientY = 13;
    const preventDefault = jest.fn();
    const data = { x: 1, y: 2 };
    const event = {
        clientX,
        clientY,
        preventDefault
    };

    test('should skip update state when tooltipHtml is not function', () => {
        const wrap = render({ tooltipHtml: null });

        wrap.find(AnyComponent).prop('onMouseEnter')(event);
        wrap.find(AnyComponent).prop('onMouseLeave')(event);

        expect(preventDefault).toHaveBeenCalledTimes(0);

        wrap.update();

        expect(wrap.state()).toEqual({
            tooltipClientX: 0,
            tooltipClientY: 0,
            tooltipData: null,
            tooltipHidden: true
        });
    });

    test('should update state when tooltipHtml is function', () => {
        const wrap = render({ tooltipHtml: () => {} });

        expect(preventDefault).toHaveBeenCalledTimes(0);
        wrap.find(AnyComponent).prop('onMouseEnter')(event, data);
        expect(preventDefault).toHaveBeenCalledTimes(1);
        wrap.find(AnyComponent).prop('onMouseLeave')(event);
        expect(preventDefault).toHaveBeenCalledTimes(2);

        wrap.update();

        expect(wrap.state()).toEqual({
            tooltipClientX: clientX,
            tooltipClientY: clientY,
            tooltipData: data,
            tooltipHidden: true
        });
    });
});

describe('renderTooltip', () => {
    test('should return null when svg ref is null', () => {
        const Component = () => null;
        const WithTooltip = withTooltip(Component);
        const wrap = mount(<WithTooltip />);

        expect(
            wrap
                .find(Component)
                .props()
                .renderTooltip()
        ).toBe(null);
    });

    test('should Tooltip component with my text', () => {
        const wrap = render({});
        const [html, xPos, yPos] = ['my content'];

        expect(
            renderTooltip(
                wrap,
                jest.fn().mockReturnValue([html, xPos, yPos])
            ).prop('children')
        ).toBe(html);
    });

    describe('tooltipContained', () => {
        test('should change translate', () => {
            const wrap = render({ tooltipContained: true });
            const getBoundingClientRect = jest.fn().mockReturnValue({
                bottom: 408,
                height: 400,
                left: 8,
                right: 408,
                top: 8,
                width: 400,
                x: 8,
                y: 8
            });

            monkeyPath(wrap, getBoundingClientRect);

            wrap.setState({
                tooltipClientX: 110,
                tooltipClientY: 100
            });

            expect(getBoundingClientRect).toHaveBeenCalledTimes(0);
            expect(
                renderTooltip(wrap, jest.fn().mockReturnValue([])).prop('style')
                    .transform
            ).toBe('translate(-25.5%, 0)');
            expect(getBoundingClientRect).toHaveBeenCalledTimes(2);
        });
    });

    describe('tooltipMode', () => {
        test('should set position relative to the svg member with the indentation', () => {
            const [top, left] = [50, 100];
            const wrap = render({
                tooltipMode: 'fixed',
                tooltipOffset: { top, left }
            });
            const [rectTop, rectLeft] = [50, 20];
            const getBoundingClientRect = jest.fn().mockReturnValue({
                height: 200,
                left: rectLeft,
                right: 400,
                top: rectTop,
                width: 300
            });

            monkeyPath(wrap, getBoundingClientRect);

            expect(
                renderTooltip(wrap, jest.fn().mockReturnValue([])).prop('style')
            ).toEqual(
                expect.objectContaining({
                    left: left + rectLeft,
                    top: top + rectTop
                })
            );
        });

        test('should set position relative to the svg member with the indentation and custom position from method renderTooltip result', () => {
            const [top, left] = [50, 100];
            const wrap = render({
                tooltipMode: 'element',
                tooltipOffset: { top, left }
            });
            const [rectTop, rectLeft] = [50, 20];
            const getBoundingClientRect = jest.fn().mockReturnValue({
                height: 200,
                left: rectLeft,
                right: 400,
                top: rectTop,
                width: 300
            });

            monkeyPath(wrap, getBoundingClientRect);

            const [xPos, yPos] = [12, 13];

            expect(
                renderTooltip(
                    wrap,
                    jest.fn().mockReturnValue(['', xPos, yPos])
                ).prop('style')
            ).toEqual(
                expect.objectContaining({
                    left: left + rectLeft + xPos,
                    top: top + rectTop + yPos
                })
            );
        });
    });
});
