import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

import {
  basicInjectSheet,
  getExposedResourceURL,
} from '../../helpers';

const css = {
  icon: {
    display: 'inline-block',
    width: 10,
    height: 10,
  },
};

const ExposedIcon = ({
  className, classes, type, ...props
}) => (
  <img
    {...props}
    src={getExposedResourceURL(`icons/${type}.svg`)}
    alt={`icon-${type}`}
    className={c(
      classes.icon,
      className,
    )}
  />
);

ExposedIcon.displayName = 'OutlinedText';

ExposedIcon.propTypes = {
  type: PropTypes.string.isRequired,
};

export default basicInjectSheet(css)(ExposedIcon);
