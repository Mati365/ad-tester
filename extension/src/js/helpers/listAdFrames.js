import * as R from 'ramda';

const AD_SELECTOR = R.join(
  ',',
  [
    'iframe[id*="_ads_iframe_"]',
    'iframe[id*="ad-iframe"]',
    'iframe[id*="-ad-"]',
    '[data-slot-name] iframe',
    '[class$="-ad"] iframe',
    '[id$="-ad"] iframe',
    '[class^="ad-"] iframe',
    '[id^="ad-"] iframe',
    '.ad_default iframe',
  ],
);

/**
 * List all AD iframes slots on page,
 * prevent to query slots that has nested
 */
export default () => R.compose(
  // detect if selected slot is part of another selector, if true - drop it
  array => R.reject(
    item => R.any(
      parentItem => (
        parentItem !== item && parentItem.contains(item)
      ),
      array,
    ),
    array,
  ),
)(
  document.querySelectorAll(AD_SELECTOR),
);
