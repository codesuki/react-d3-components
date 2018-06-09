import React from 'react';
import { shallow } from 'enzyme';
import Tooltip from '../Tooltip';

const render = ({
    hidden = false,
    top = 0,
    left = 0,
    html = '',
    translate = 0,
    ...props
}) =>
    shallow(
        <Tooltip
            top={top}
            left={left}
            html={html}
            translate={translate}
            hidden={hidden}
            {...props}
        />
    );

test('should render custom content', () => {
    const html = 'text';
    const wrap = render({
        html
    });

    expect(wrap.prop('children')).toBe(html);
});

test('should set style by props', () => {
    const top = 12;
    const left = 32;
    const translate = 20;

    const wrap = render({
        top,
        left,
        translate
    });

    expect(wrap.prop('style')).toEqual(
        expect.objectContaining({
            left,
            top,
            transform: `translate(-${translate}%, 0)`
        })
    );
});

test('should hide element', () => {
    expect(
        render({
            hidden: false
        }).prop('style').display
    ).toBe('');

    expect(
        render({
            hidden: true
        }).prop('style').display
    ).toBe('none');
});
