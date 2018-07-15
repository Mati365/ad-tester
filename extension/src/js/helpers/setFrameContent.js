import * as R from 'ramda';

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

    frame.srcdoc = code;
    frame.onload = () => {
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
