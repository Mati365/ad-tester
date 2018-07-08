import React from 'react';

const CheckboxGroup = ({
  children, value, style, onChange, ...props
}) => (
  <div
    {...props}
    style={{
      height: 20,
      lineHeight: '22px',
      ...style,
    }}
  >
    <input
      type='checkbox'
      style={{
        marginRight: 5,
        cursor: 'pointer',
      }}
      checked={value}
      onChange={() => onChange && onChange(!value)}
    />
    <span>
      {children}
    </span>
  </div>
);

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
