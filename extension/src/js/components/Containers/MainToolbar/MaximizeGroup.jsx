import React from 'react';

import {ToolbarIcon} from '../../Shared/Toolbar';
import SecondaryToolbarIcon from './SecondaryToolbarIcon';

const MaximizeGroup = ({minimized, onSetMinimize}) => (
  <>
    {minimized
      ? (
        <SecondaryToolbarIcon
          type='window-maximize'
          onClick={() => onSetMinimize(false)}
        />
      )
      : (
        <SecondaryToolbarIcon
          type='window-minimize'
          onClick={() => onSetMinimize(true)}
        />
      )
    }
    <ToolbarIcon type='close' />
  </>
);

MaximizeGroup.displayName = 'MaximizeGroup';

export default MaximizeGroup;
