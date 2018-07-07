import React from 'react';
import c from 'classnames';

import basicInjectSheet from '../../helpers/basicInjectSheet';

const css = {
  textMuted: {
    fontFamily: 'Verdana,sans-serif',
    opacity: 0.6,
  },
};

const TextMuted = ({className, classes, ...props}) => (
  <span
    {...props}
    className={c(
      classes.textMuted,
      className,
    )}
  />
);

TextMuted.displayName = 'TextMuted';

export default basicInjectSheet(css)(TextMuted);
