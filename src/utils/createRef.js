import { createRef as ReactCreateRef } from 'react';
import PropTypes from 'prop-types';

// support new React ref API and fallback https://reactjs.org/docs/refs-and-the-dom.html
export const createRef =
    ReactCreateRef ||
    (() => {
        let current = null;
        const ref = elm => current = elm;

        Object.defineProperty(ref, 'current', {
            get: () => current,
            enumerable: true,
            configurable: true
        });

        return ref;
    });

export const refType = PropTypes.oneOfType([PropTypes.func, PropTypes.object]);
