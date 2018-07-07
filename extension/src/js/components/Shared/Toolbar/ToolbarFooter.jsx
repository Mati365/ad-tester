import React from 'react';
import c from 'classnames';

import {TOOLBAR_BORDER} from '../../../constants/colors';
import {basicInjectSheet} from '../../../helpers';

export const FOOTER_HEIGHT = 23;

const css = {
  toolbarFooter: {
    display: 'flex',
    alignItems: 'center',
    height: FOOTER_HEIGHT,
    padding: '0 7px',
    fontSize: 11,
    borderTop: `1px solid ${TOOLBAR_BORDER}`,
    background: '#fff',
  },
};

const ToolbarFooter = ({
  children, className, classes, ad, ...props
}) => (
  <div
    {...props}
    className={c(
      classes.toolbarFooter,
      className,
    )}
  >
    {children}
  </div>
);

ToolbarFooter.displayName = 'ToolbarFooter';

export default basicInjectSheet(css)(ToolbarFooter);
