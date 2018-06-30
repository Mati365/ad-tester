import React from 'react';
import c from 'classnames';

import basicInjectSheet from '../../helpers/basicInjectSheet';

const css = {
  layerCentered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
};

const CenteredLayer = ({className, classes, ...props}) => (
  <div
    {...props}
    className={c(
      className,
      classes.layerCentered,
    )}
  />
);

CenteredLayer.displayName = 'CenteredLayer';

export default basicInjectSheet(css)(CenteredLayer);
