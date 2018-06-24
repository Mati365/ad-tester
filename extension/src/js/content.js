import * as R from 'ramda';

import listAdFrames from './helpers/listAdFrames';
import * as backend from './background';

backend.setBadgeBackgroundColor('red');

/**
 * Displays frames count in badge, if badge > 10 displays '10+'
 * @param {Array} frames
 */
const setFramesInfoBadge = R.compose(
  backend.setBadgeText,
  R.cond([
    [R.lt(10), R.always('10+')],
    [R.T, R.identity],
  ]),
  R.length,
);

setInterval(
  () => {
    const frames = listAdFrames();
    console.log(setFramesInfoBadge(frames));
  },
  2000,
);
