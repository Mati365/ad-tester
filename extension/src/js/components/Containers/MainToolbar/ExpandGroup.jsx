import React from 'react';

import hasFlag from '../../../helpers/hasFlag';
import {ToggleableSecondaryIcon} from './ToggleableIcon';

const ExpandGroup = ({
  toggled, style, toggleFlag,
  onSetToggle,
}) => (
  <>
    <ToggleableSecondaryIcon
      type='arrow-right'
      toggleFlags={{
        activeOnFlag: () => !hasFlag(toggleFlag, toggled),
        setOnToggle: toggleFlag,
      }}
      {...{toggled, style, onSetToggle}}
    />
    <ToggleableSecondaryIcon
      type='arrow-left'
      toggleFlags={{
        activeOnFlag: toggleFlag,
        setOnToggle: toggled,
      }}
      {...{toggled, style, onSetToggle}}
    />
  </>
);

ExpandGroup.displayName = 'ExpandGroup';

export default ExpandGroup;
