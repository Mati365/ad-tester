import * as R from 'ramda';

import {IFRAME_ANALYZE_ATTRIBUTE} from '../constants';

import * as backend from '../background';
import generateUUID from './generateUUID';

const BLANK_SRC = '';

/**
 * Set code in frame end returns promise
 * with requests detail
 *
 * @param {String}      code
 * @param {HTMLElement} frame
 */
const setFrameContent = R.curry(
  (code, frame) => new Promise(async (resolve) => {
    const analyzeUUID = generateUUID('iframe-analyze');

    frame.srcdoc = BLANK_SRC;
    await backend.startFrameAnalyze(analyzeUUID);
    await backend.runOnAnalyzeIdle();

    frame.setAttribute(IFRAME_ANALYZE_ATTRIBUTE, analyzeUUID);
    frame.srcdoc = code;
    frame.onload = () => {
      frame.removeAttribute(IFRAME_ANALYZE_ATTRIBUTE);

      setTimeout(
        () => {
          backend
            .endFrameAnalyze()
            .then(resolve);
        },
        200,
      );
    };
  }),
);

export default setFrameContent;
