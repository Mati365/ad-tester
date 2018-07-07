import React from 'react';

import AD_SCHEMA from '../../../constants/adSchema';

import {toStringDimensions} from '../../../helpers';
import {
  IconGroup,
  TextMuted,
  PullAlign,
} from '../../Shared';

const EditorFooter = ({ad}) => (
  <IconGroup
    type='ruler'
    style={{
      width: 14,
      height: 14,
    }}
  >
    <PullAlign.Right>
      <TextMuted>
        {toStringDimensions(ad.dimensions)}
      </TextMuted>
    </PullAlign.Right>
  </IconGroup>
);

EditorFooter.displayName = 'EditorFooter';

EditorFooter.propTypes = {
  ad: AD_SCHEMA.isRequired,
};

export default EditorFooter;
