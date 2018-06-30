import React from 'react';
import PropTypes from 'prop-types';

import withProps from '../../decorators/withProps';

const PullAlign = ({
  style, direction,
  ...props
}) => (
  <span
    {...props}
    style={{
      ...style,
      [direction === 'right' ? 'marginLeft' : 'marginRight']: 'auto',
      float: direction, // fallback only
    }}
  />
);

PullAlign.displayName = 'PullAlign';

PullAlign.propTypes = {
  direction: PropTypes.oneOf(['right', 'left']).isRequired,
};

export const PullRight = withProps(
  {
    direction: 'right',
  },
)(PullAlign);

export default PullAlign;
