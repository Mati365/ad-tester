import React from 'react';
import ReactDOM from 'react-dom';
import * as R from 'ramda';

import listAdFrames from './helpers/listAdFrames';
import addFrameLayer from './helpers/addFrameLayer';

import MainToolbar from './components/Containers/MainToolbar';
import * as backend from './background';

const formatFramesArray = R.compose(
  R.cond([
    [R.equals(0), R.always('')],
    [R.lt(99), R.always('99+')],
    [R.T, R.identity],
  ]),
  R.length,
);

/**
 * Displays frames count in badge
 *
 * @param {Array} frames
 */
const setFramesInfoBadge = async (frames) => {
  await backend.setBadgeBackgroundColor('red');
  return backend.setBadgeText(
    formatFramesArray(frames),
  );
};

/**
 * Lists all ad frames on page
 */
const updateFramesMiddleware = () => {
  const frames = listAdFrames();
  setFramesInfoBadge(frames);

  R.forEach(
    addFrameLayer,
    frames,
  );
};

setInterval(updateFramesMiddleware, 2000);
updateFramesMiddleware();

/**
 * Display toolbar panel
 */
const toolbarContainer = document.createElement('div');
ReactDOM.render(
  <MainToolbar />,
  toolbarContainer,
);
document.body.appendChild(toolbarContainer);
