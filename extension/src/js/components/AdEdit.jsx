import React from 'react';
import PropTypes from 'prop-types';

import OutlinedText from './OutlinedText';

const AdEdit = ({
  style, children, titled, ...props
}) => (
  <div
    {...props}
    style={{
      ...style,
      position: 'absolute',
      left: 0,
      top: 0,
      padding: '8px 12px',
      background: 'rgba(80, 80, 80, 0.35)',
      borderRight: '1px solid rgba(80, 80, 80, 0.35)',
      borderBottom: '1px solid rgba(80, 80, 80, 0.35)',
      fontSize: 12,
      cursor: 'pointer',
    }}
  >
    <OutlinedText>
      <span
        style={{
          marginRight: titled ? 6 : 0,
        }}
      >
        ✎
      </span>
      {titled && (
        chrome.i18n.getMessage('edit_ad')
      )}
    </OutlinedText>
    {children}
  </div>
);

AdEdit.displayName = 'AdEdit';

AdEdit.propTypes = {
  titled: PropTypes.bool,
};

AdEdit.defaultProps = {
  titled: true,
};

export default AdEdit;
