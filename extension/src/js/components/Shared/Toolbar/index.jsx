import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

import basicInjectSheet from '../../../helpers/basicInjectSheet';
import ToolbarHeader, {TOOLBAR_HEIGHT} from './ToolbarHeader';

export {default as ToolbarIcon} from './ToolbarIcon';
export {TOOLBAR_HEIGHT} from './ToolbarHeader';

const css = {
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    minHeight: TOOLBAR_HEIGHT,
    background: '#fff',
    zIndex: 99999999,
  },
  header: {},
  content: {
    flex: 1,
    flexShrink: 1,
    maxHeight: `calc(100% - ${TOOLBAR_HEIGHT}px)`,
    background: '#fff',
  },
};

const Toolbar = ({
  children, className, classes, panel, rightPanel, withRef, ...props
}) => (
  <div
    {...props}
    {...withRef && {ref: withRef}}
    className={c(
      classes.toolbar,
      className,
    )}
  >
    <ToolbarHeader
      rightPanel={rightPanel}
      className={classes.header}
    >
      {panel}
    </ToolbarHeader>
    {children && (
      <div className={classes.content}>
        {children}
      </div>
    )}
  </div>
);

Toolbar.displayName = 'Toolbar';

Toolbar.propTypes = {
  panel: PropTypes.node,
  rightPanel: PropTypes.node,
};

Toolbar.defaultProps = {
  panel: null,
  rightPanel: null,
};

export default basicInjectSheet(css)(Toolbar);
