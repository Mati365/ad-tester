import React from 'react';

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
  </>
);

MaximizeGroup.displayName = 'MaximizeGroup';

export default MaximizeGroup;
