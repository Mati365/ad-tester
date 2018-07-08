import React from 'react';
import c from 'classnames';

import basicInjectSheet from '../../helpers/basicInjectSheet';
import {withProps} from '../../decorators';

const css = {
  text: {
    fontFamily: 'Verdana,sans-serif',
  },
};

const Text = basicInjectSheet(css)(
  ({className, classes, ...props}) => (
    <span
      {...props}
      className={c(
        classes.text,
        className,
      )}
    />
  ),
);

Text.displayName = 'Text';

Text.Muted = withProps(
  {
    style: {
      opacity: 0.6,
    },
  },
)(Text);

Text.Danger = withProps(
  {
    style: {
      color: '#cc2020',
    },
  },
)(Text);

Text.Validated = ({validator, ...props}) => {
  const Component = validator(props)
    ? Text.Muted
    : Text.Danger;

  return (
    <Component {...props} />
  );
};

export default Text;
