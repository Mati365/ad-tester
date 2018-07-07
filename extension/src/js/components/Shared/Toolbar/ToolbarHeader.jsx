import React from 'react';
import c from 'classnames';
import PropTypes from 'prop-types';

import basicInjectSheet from '../../../helpers/basicInjectSheet';
import * as colors from '../../../constants/colors';

import PullAlign from '../PullAlign';

export const TOOLBAR_HEIGHT = 28;

const css = {
  toolbarHeader: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',

    width: '100%',
    minHeight: TOOLBAR_HEIGHT - 2, // with bottom and top border, minus border
    lineHeight: `${TOOLBAR_HEIGHT - 2}px`,
    padding: '0 7px',
    borderWidth: '1px 0 1px 0',
    borderStyle: 'solid',
    borderColor: colors.TOOLBAR_BORDER,
    background: colors.TOOLBAR_HEADER_BACKGROUND,
    boxSizing: 'border-box',
    '& *': {
      boxSizing: 'border-box',
    },
    '&:last-child': {
      borderBottomWidth: 0,
    },
  },
};

const ToolbarHeader = ({
  children, rightPanel, className, classes, ...props
}) => (
  <div
    {...props}
    className={c(
      classes.toolbarHeader,
      className,
    )}
  >
    {children}
    {rightPanel && (
      <PullAlign.Right>
        {rightPanel}
      </PullAlign.Right>
    )}
  </div>
);

ToolbarHeader.displayName = 'ToolbarHeader';

ToolbarHeader.propTypes = {
  rightPanel: PropTypes.node,
};

ToolbarHeader.defaultProps = {
  rightPanel: null,
};

export default basicInjectSheet(css)(ToolbarHeader);
