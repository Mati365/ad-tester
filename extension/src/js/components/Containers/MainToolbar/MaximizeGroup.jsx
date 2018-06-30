import React from 'react';

import VISIBILITY_STATE from '../../../constants/toolbarVisibilityState';

import {ToolbarIcon} from '../../Shared/Toolbar';
import {ToggleableSecondaryIcon} from './ToggleableIcon';

const MaximizeGroup = ({toggled, onSetToggle}) => (
  <>
    <ToggleableSecondaryIcon
      type='window-maximize'
      toggleFlags={{
        activeOnFlag: VISIBILITY_STATE.MINIMIZED,
        setOnToggle: VISIBILITY_STATE.MAXIMIZED,
      }}
      {...{toggled, onSetToggle}}
    />
    <ToggleableSecondaryIcon
      type='window-minimize'
      toggleFlags={{
        activeOnFlag: VISIBILITY_STATE.MAXIMIZED,
        setOnToggle: VISIBILITY_STATE.MINIMIZED,
      }}
      {...{toggled, onSetToggle}}
    />
    <ToolbarIcon type='close' />
  </>
);

MaximizeGroup.displayName = 'MaximizeGroup';

export default MaximizeGroup;
