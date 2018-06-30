import React from 'react';
import ReactDOM from 'react-dom';
import * as R from 'ramda';

import AdLayer from '../components/Containers/AdOverlay/AdLayer';

/**
 * Adds frame layer on top elemen
 *
 * @param {HTMLElement} element
 */
const addFrameLayer = (element) => {
  if (!element || element.withFrameLayer)
    return element;

  const frameLayer = document.createElement('div');
  ReactDOM.render(
    <AdLayer element={element} />,
    frameLayer,
  );
  document.body.appendChild(frameLayer);

  // watch element remove to prevent mem leak
  const observer = new MutationObserver(
    R.forEach(
      (mutation) => {
        if (mutation.type !== 'childList')
          return;

        // todo
        observer.disconnect();
      },
    ),
  );

  observer.observe(element, {
    childList: true,
    subtree: true,
  });

  element.withFrameLayer = true; // eslint-disable-line no-param-reassign

  // add optional styles
  element.style.filter = 'grayscale(100%)'; // eslint-disable-line no-param-reassign

  return element;
};

export default addFrameLayer;
