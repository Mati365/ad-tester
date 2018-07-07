import React from 'react';
import c from 'classnames';

import basicInjectSheet from '../../helpers/basicInjectSheet';

const css = {
  outlinedText: {
    fontFamily: 'Verdana,sans-serif',
    fontSize: 12,
    color: '#fff',
    textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
  },
};

const OutlinedText = ({className, classes, ...props}) => (
  <span
    {...props}
    className={c(
      classes.outlinedText,
      className,
    )}
  />
);

OutlinedText.displayName = 'OutlinedText';

export default basicInjectSheet(css)(OutlinedText);
