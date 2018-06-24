import React from 'react';

const CenteredLayer = ({style, ...props}) => (
  <div
    {...props}
    style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    }}
  />
);

CenteredLayer.displayName = 'CenteredLayer';

export default CenteredLayer;
