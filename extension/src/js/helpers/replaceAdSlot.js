import * as R from 'ramda';

import {MAGIC_START_TRACKING_FRAME_URL} from '../constants';
import setFrameContent from './setFrameContent';

const wrapWithHTMLSkel = (code, headTags = '', tags = '') => `
  <html>
    <head>
      <title>AD PREVIEW</title>
      <meta charset="UTF-8" />
      <style>
        body, html {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
      </style>
      ${headTags}
    </head>

    <body>
      ${tags}
      ${code}
    </body>
  </html>
`;

/**
 * @param {string}  tag
 * @param {object}  string
 */
const createElement = (tag, styles, attributes) => {
  const frame = document.createElement(tag);
  if (styles)
    Object.assign(frame.style, styles);

  if (attributes) {
    R.forEachObjIndexed(
      (attribute, key) => frame.setAttribute(key, attribute),
      attributes,
    );
  }
  return frame;
};

/**
 * Searchs DOM for ad slot selector, search also already loaded slots
 *
 * @param {string}  selector
 */
const searchSlot = selector => (
  document.querySelector(selector)
);

/**
 * Replaces current ad slot iframe with
 * iframe with test code ad. It will be better
 * to replace DIV with new element to prevent
 * bugs in already attached scripts
 *
 * @param {string}  selector
 * @param {string}  code
 * @param {object}  styles
 */
const replaceAdSlot = (selector, code, styles = {}) => {
  const element = selector instanceof Element
    ? selector
    : searchSlot(selector);

  if (!element)
    return false;

  const {parentNode: parent} = element;
  if (!parent)
    return null;

  let frame = parent.querySelector('[data-ad-preview]');
  const cached = !!frame;
  if (!frame) {
    frame = createElement(
      'iframe',
      {
        ...(styles || {}),
        width: `${element.offsetWidth}px`,
        height: `${element.offsetHeight}px`,
        margin: 0,
        border: '1px dashed rgba(0, 0, 0, 0.45)',
      },
      {
        'data-ad-preview': true,
      },
    );
  }

  if (!cached) {
    parent.appendChild(frame);
    parent.removeChild(element);
  }

  /**
   * Wraps provided code with basic
   * html skeleton
   */
  const html = wrapWithHTMLSkel(
    code,
    `
      <style>
        html, body {
          overflow: hidden;
          border: 1px dotted gray;
          width: ${element.offsetWidth}px;
          height: ${element.offsetHeight}px;
        }
      </style>
    `,
    `
      <img
        src='${MAGIC_START_TRACKING_FRAME_URL}'
        style='position: fixed;left: -1111px;top: -1111px;width: 1px;height:1px;opacity:0'
      ></img>
    `,
  );

  return {
    detailsPromise: setFrameContent(html, frame),
    element,
  };
};

export default replaceAdSlot;
