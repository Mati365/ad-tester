import React from 'react';
import ReactDOM from 'react-dom';

import {AD_PREVIEW_ATTRIBUTE} from '../constants';

import generateUUID from './generateUUID';
import AdLayer from '../components/Containers/AdOverlay/AdLayer';

/**
 * All layers in slots will be mounted
 * to this div, removing this div
 * will hide all layers
 */
const FRAME_LAYER_ROOT = document.createElement('ad-preview-layer');
document.body.appendChild(FRAME_LAYER_ROOT);

/**
 * Checks if element or its children has any ad preview
 *
 * @param {HTMLElement} element
 * @returns True if container has ad preview
 */
const hasPreviewAd = element => (
  element.hasAttribute(AD_PREVIEW_ATTRIBUTE) || !!element.querySelector(`[${AD_PREVIEW_ATTRIBUTE}]`)
);

/**
 * Adds frame layer on top elemen
 *
 * @param {HTMLElement} element
 */
const addFrameLayer = (element) => {
  if (!element || hasPreviewAd(element))
    return element;

  const uuid = generateUUID('ad-preview');
  element.setAttribute(AD_PREVIEW_ATTRIBUTE, uuid);

  const frameLayer = document.createElement('ad-preview');
  ReactDOM.render(
    <AdLayer
      uuid={uuid}
      element={element}
    />,
    frameLayer,
  );
  FRAME_LAYER_ROOT.appendChild(frameLayer);

  return element;
};

export default addFrameLayer;
