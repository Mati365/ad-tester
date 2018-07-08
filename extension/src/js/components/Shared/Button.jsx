import React from 'react';
import PropTypes from 'prop-types';

import {styled} from '../../helpers/basicInjectSheet';
import Text from './Text';

const Button = styled(
  'button',
  {
    root: {
      padding: '0 14px',
      height: 20,
      lineHeight: '18px',
      border: '1px solid',
      outline: 0,
      cursor: 'pointer',
      transition: '180ms ease-in-out',
      transitionProperty: 'background, border-color, opacity',
    },
    blue: {
      background: '#4d90fe',
      borderColor: '#3079ed',
      color: '#fff',

      '&:hover': {
        background: '#357ae8',
        borderColor: '#2f5bb7',
      },
    },
    disabled: {
      opacity: 0.6,
      pointerEvents: 'none',
    },
  },
  (classes, {type, disabled}) => ([
    classes[type],
    disabled && classes.disabled,
  ]),
  ({children}) => ({
    children: (
      <Text>
        {children}
      </Text>
    ),
  }),
);

Button.displayName = 'Button';

Button.propTypes = {
  type: PropTypes.string,
};

Button.defaultProps = {
  type: 'blue',
};

export default Button;
