import React from 'react';
import PropTypes from 'prop-types';

import {
  MAX_SAFE_AD_SIZE,
  AD_SCHEMA,
  MAX_SAFE_REQUEST_COUNT,
} from '../../../constants';

import {toStringDimensions} from '../../../helpers';

import Text from '../../Shared/Text';
import {
  IconGroup,
  Button,
  CheckboxGroup,
  FlexColumn,
} from '../../Shared';

const EditorFooter = ({
  ad, liveReload,
  onChangeLiveReload, onPreview,
}) => {
  const {
    size,
    totalRequests,
  } = ad.details || {};

  const details = ad.details && (
    <>
      <IconGroup
        type='download'
        style={{
          width: 14,
          height: 14,
          marginLeft: 10,
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
          {' '}
          {chrome.i18n.getMessage('requests')}
        </Text.Validated>
      </IconGroup>
    </>
  );

  return (
    <>
      <FlexColumn>
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

        {details}
      </FlexColumn>

      <FlexColumn>
        <CheckboxGroup
          value={liveReload}
          style={{
            marginRight: 10,
          }}
          onChange={onChangeLiveReload}
        >
          {chrome.i18n.getMessage('live_preview')}
        </CheckboxGroup>

        <CheckboxGroup
          style={{
            marginRight: 10,
          }}
        >
          {chrome.i18n.getMessage('page_reload_preview')}
        </CheckboxGroup>

        <Button
          disabled={liveReload}
          onClick={onPreview}
        >
          {chrome.i18n.getMessage('preview_ad')}
        </Button>
      </FlexColumn>
    </>
  );
};

EditorFooter.displayName = 'EditorFooter';

EditorFooter.propTypes = {
  ad: AD_SCHEMA.isRequired,
  liveReload: PropTypes.bool.isRequired,
  onChangeLiveReload: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
};

export default EditorFooter;
