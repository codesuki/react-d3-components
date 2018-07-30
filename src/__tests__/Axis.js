import d3 from 'd3';
import React from 'react';
import { shallow } from 'enzyme';
import Axis from '../Axis';

const defaultProps = {
    tickArguments: [10],
    tickValues: null,
    tickFormat: null,
    tickDirection: 'horizontal',
    innerTickSize: 6,
    tickPadding: 3,
    outerTickSize: 6,
    className: 'axis',
    zero: 0,
    label: '',
    height: 0,
    scale: d3.scale.linear(),
    orientation: ''
};

const render = props => shallow(<Axis {...defaultProps} {...props} />);

describe('render', () => {
    test('should render top & diagonal', () => {
        const tickValues = [-2, -1, 0, 1, 3, 9];
        const wrap = render({
            tickValues,
            tickFormat: v => `${v}--custom-format`,
            orientation: 'top',
            tickDirection: 'diagonal'
        });
        const ticks = wrap.find('.tick');

        expect(ticks.length).toBe(tickValues.length);
        expect(ticks.first().props()).toEqual(
            expect.objectContaining({
                className: 'tick',
                transform: 'translate(-2, 0)'
            })
        );
        expect(
            ticks
                .first()
                .find('text')
                .props()
        ).toEqual({
            children: `${tickValues[0]}--custom-format`,
            dy: '0em',
            textAnchor: 'end',
            transform: 'rotate(-60)',
            x: -9,
            y: 0
        });
        expect(
            ticks
                .first()
                .find('line')
                .props()
        ).toEqual({ stroke: '#aaa', x2: 0, y2: -6 });
    });

    test('should render bottom & vertical', () => {
        const tickValues = [22, 37, 38, 39, 55];
        const wrap = render({
            tickValues,
            orientation: 'bottom',
            tickDirection: 'vertical',
            tickFormat: () => {}
        });
        const ticks = wrap.find('.tick');

        expect(ticks.length).toBe(tickValues.length);
        expect(ticks.first().props()).toEqual(
            expect.objectContaining({
                className: 'tick',
                transform: `translate(${tickValues[0]}, 0)`
            })
        );
        expect(
            ticks
                .first()
                .find('text')
                .props()
        ).toEqual({
            children: undefined,
            dy: '.71em',
            textAnchor: 'end',
            transform: 'rotate(-90)',
            x: -9,
            y: -6
        });
        expect(
            ticks
                .first()
                .find('line')
                .props()
        ).toEqual({ stroke: '#aaa', x2: 0, y2: 6 });
    });

    test('should render left & vertical', () => {
        const tickValues = [5, -5];
        const wrap = render({
            tickValues,
            orientation: 'left',
            tickDirection: 'vertical'
        });
        const ticks = wrap.find('.tick');

        expect(ticks.length).toBe(tickValues.length);
        expect(ticks.first().props()).toEqual(
            expect.objectContaining({
                className: 'tick',
                transform: `translate(0, ${tickValues[0]})`
            })
        );
        expect(
            ticks
                .first()
                .find('text')
                .props()
        ).toEqual({
            children: '5.0',
            dy: '.32em',
            textAnchor: 'middle',
            transform: 'rotate(-90)',
            x: 0,
            y: -15
        });
        expect(
            ticks
                .first()
                .find('line')
                .props()
        ).toEqual({ stroke: '#aaa', x2: -6, y2: 0 });
    });
    test('should render right & diagonal', () => {
        render({
            tickValues: [
                new Date('2018-02-12'),
                new Date('2018-02-13'),
                new Date('2018-02-14')
            ],
            orientation: 'right',
            tickDirection: 'diagonal'
        });
    });

    test('custom zero', () => {
        render({
            tickValues: [
                new Date('2018-02-12'),
                new Date('2018-02-13'),
                new Date('2018-02-14')
            ],
            orientation: 'right',
            tickDirection: 'diagonal'
        });
    });
});

describe('getTranslateString', () => {
    const className = 'qwertyui';
    const wrap = render({
        className,
        orientation: 'top'
    });
    const find = wrap => wrap.find(`g.${className}`);

    test('should return default value when orientation type not know', () => {
        expect(
            find(
                wrap.setProps({
                    orientation: 'BAD_VALUE'
                })
            ).prop('transform')
        ).toBe('');
    });

    test('should set zero transform when orientation top', () => {
        const zero = 9;

        expect(
            wrap
                .setProps({
                    orientation: 'top',
                    zero
                })
                .find(`g.${className}`)
                .prop('transform')
        ).toBe(`translate(0, ${zero})`);
    });

    test('should set transformY from height property when orientation bottom and zero is 0', () => {
        const zero = 0;
        const height = 123;

        expect(
            wrap
                .setProps({
                    orientation: 'bottom',
                    zero,
                    height
                })
                .find(`g.${className}`)
                .prop('transform')
        ).toBe(`translate(0, ${height})`);
    });

    test("should set transformY from zero property when orientation bottom and zero isn't 0", () => {
        const zero = 32;

        expect(
            wrap
                .setProps({
                    orientation: 'bottom',
                    zero
                })
                .find(`g.${className}`)
                .prop('transform')
        ).toBe(`translate(0, ${zero})`);
    });

    test('should set transformX from zero property when orientation left', () => {
        const zero = 312;

        expect(
            wrap
                .setProps({
                    orientation: 'left',
                    zero
                })
                .find(`g.${className}`)
                .prop('transform')
        ).toBe(`translate(${zero}, 0)`);
    });

    test('should set transformX from zero property when orientation right and zero not 0', () => {
        const zero = 312;

        expect(
            wrap
                .setProps({
                    orientation: 'right',
                    zero
                })
                .find(`g.${className}`)
                .prop('transform')
        ).toBe(`translate(${zero}, 0)`);
    });

    test('should set transformX from width property when orientation right and zero is 0', () => {
        const zero = 0;
        const width = 313;

        expect(
            wrap
                .setProps({
                    orientation: 'right',
                    zero,
                    width
                })
                .find(`g.${className}`)
                .prop('transform')
        ).toBe(`translate(${width}, 0)`);
    });
});
