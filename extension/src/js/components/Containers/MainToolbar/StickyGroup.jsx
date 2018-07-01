import React from 'react';

import SecondaryToolbarIcon from './SecondaryToolbarIcon';

const StickyGroup = ({sticky, dimensions, onSetDimensions}) => (
  <>
    {sticky.w
      ? (
        <SecondaryToolbarIcon
          type='arrow-right'
          style={{
            marginLeft: 0,
          }}
          onClick={() => {
            onSetDimensions(
              {
                ...dimensions,
                x: window.innerWidth / 2,
                w: window.innerWidth / 2,
              },
              true,
            );
          }}
        />
      )
      : (
        <SecondaryToolbarIcon
          type='arrow-left'
          style={{
            marginLeft: 0,
          }}
          onClick={() => {
            onSetDimensions(
              {
                ...dimensions,
                x: 0,
                w: window.innerWidth,
              },
              true,
            );
          }}
        />
      )
    }
  </>
);

StickyGroup.displayName = 'StickyGroup';

export default StickyGroup;
