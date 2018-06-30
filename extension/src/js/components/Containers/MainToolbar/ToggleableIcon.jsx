import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

import hasFlag, {addFlag, removeFlag} from '../../../helpers/hasFlag';
import {withProps} from '../../../decorators';

import {ToolbarIcon} from '../../Shared/Toolbar';

const ToggleableIcon = ({
  toggled, onSetToggle, toggleFlags,
  ...props
}) => {
  let test = true;

  if (R.is(Function, toggleFlags.activeOnFlag))
    test = toggleFlags.activeOnFlag(toggled);
  else
    test = hasFlag(toggleFlags.activeOnFlag, toggled);

  return (
    test
      ? (
        <ToolbarIcon
          {...props}
          onClick={
            () => onSetToggle(
              R.compose(
                removeFlag(toggleFlags.activeOnFlag),
                addFlag(toggleFlags.setOnToggle),
              )(toggled),
            )
          }
        />
      )
      : null
  );
};

ToggleableIcon.displayName = 'ToggleableIcon';

ToggleableIcon.propTypes = {
  toggleFlags: PropTypes.shape({
    setOnToggle: PropTypes.number,
    activeOnFlag: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.func,
    ]),
  }).isRequired,

  onSetToggle: PropTypes.func.isRequired,
};

export const ToggleableSecondaryIcon = withProps(
  {
    style: {
      marginRight: 11,
      height: 14,
      width: 14,
    },
  },
)(ToggleableIcon);

export default ToggleableIcon;
