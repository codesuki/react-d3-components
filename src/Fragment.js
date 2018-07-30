import React, { Fragment as ReactFragment } from 'react';

const Fragment = ({ children, ...props }) => <div {...props}>{children}</div>;

export default (ReactFragment ? ReactFragment : Fragment);
