import React from 'react';
import c from 'classnames';

import {basicInjectSheet} from '../../helpers';
import ExposedIcon from './ExposedIcon';
import FlexColumn from './FlexColumn';

const css = {
  groupIcon: {
    marginRight: 5,
  },
};

const IconGroup = ({
  children, className, classes,
  ...props
}) => (
  <FlexColumn>
    <ExposedIcon
      {...props}
      className={c(
        className,
        classes.groupIcon,
      )}
    />
    <span>
      {children}
    </span>
  </FlexColumn>
);

IconGroup.displayName = 'IconGroup';

export default basicInjectSheet(css)(IconGroup);
