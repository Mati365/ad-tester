const AD_SELECTOR = 'iframe[id*="_ads_iframe_"], iframe[id*="ad-iframe"], .ad_default iframe';

/**
 * List all AD iframes slots on page
 */
export default () => (
  document.querySelectorAll(AD_SELECTOR)
);
