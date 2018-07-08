import React from 'react';

import {styled} from '../../helpers/basicInjectSheet';
import {withProps} from '../../decorators';

const Text = styled(
  'span',
  {
    root: {
      fontFamily: 'Verdana,sans-serif',
    },
  },
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
