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
      display: 'inherit',
      [direction === 'right' ? 'marginLeft' : 'marginRight']: 'auto',
      float: direction, // fallback only
    }}
  />
);

PullAlign.displayName = 'PullAlign';

PullAlign.propTypes = {
  direction: PropTypes.oneOf(['right', 'left']).isRequired,
};

PullAlign.Right = withProps(
  {
    direction: 'right',
  },
)(PullAlign);

PullAlign.Left = withProps(
  {
    direction: 'left',
  },
)(PullAlign);

export default PullAlign;
