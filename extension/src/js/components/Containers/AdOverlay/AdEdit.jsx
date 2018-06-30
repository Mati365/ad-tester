import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

import basicInjectSheet from '../../../helpers/basicInjectSheet';
import OutlinedText from '../../Shared/OutlinedText';

const css = {
  adEdit: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: '8px 12px',
    background: 'rgba(80, 80, 80, 0.35)',
    borderRight: '1px solid rgba(80, 80, 80, 0.35)',
    borderBottom: '1px solid rgba(80, 80, 80, 0.35)',
    fontSize: 12,
    cursor: 'pointer',
  },
};

const AdEdit = ({
  children, titled, classes, className, ...props
}) => (
  <div
    {...props}
    className={c(
      classes.adEdit,
      className,
    )}
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

export default basicInjectSheet(css)(AdEdit);
