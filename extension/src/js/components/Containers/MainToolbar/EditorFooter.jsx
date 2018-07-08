import React from 'react';

import {
  MAX_SAFE_AD_SIZE,
  AD_SCHEMA,
  MAX_SAFE_REQUEST_COUNT,
} from '../../../constants';

import {toStringDimensions} from '../../../helpers';

import Text from '../../Shared/Text';
import {
  IconGroup,
  PullAlign,
} from '../../Shared';

const EditorFooter = ({ad}) => {
  const {
    size,
    totalRequests,
  } = ad.details || {};

  return (
    <>
      {ad.details && (
        <>
          <IconGroup
            type='download'
            style={{
              width: 14,
              height: 14,
            }}
          >
            <Text.Validated
              validator={
                () => (size / 1024) < MAX_SAFE_AD_SIZE
              }
            >
              {`${(size / 1024).toFixed(2)}kB`}
            </Text.Validated>
          </IconGroup>

          <IconGroup
            type='requests'
            style={{
              width: 16,
              height: 16,
              marginRight: 3,
              marginLeft: 10,
            }}
          >
            <Text.Validated
              validator={
                () => totalRequests < MAX_SAFE_REQUEST_COUNT
              }
            >
              {totalRequests}
            </Text.Validated>
          </IconGroup>
        </>
      )}
      <PullAlign.Right>
        <IconGroup
          type='ruler'
          style={{
            width: 14,
            height: 14,
          }}
        >
          <Text.Muted>
            {toStringDimensions(ad.dimensions)}
          </Text.Muted>
        </IconGroup>
      </PullAlign.Right>
    </>
  );
};

EditorFooter.displayName = 'EditorFooter';

EditorFooter.propTypes = {
  ad: AD_SCHEMA.isRequired,
};

export default EditorFooter;
