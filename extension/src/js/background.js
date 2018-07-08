import * as R from 'ramda';

import cacheCall from './helpers/cacheCall';
import pickContentLength from './helpers/pickContentLength';

import {IFRAME_ANALYZE_ATTRIBUTE} from './constants';

const isBackgroundScript = R.is(
  Function,
  chrome && chrome.browserAction && chrome.browserAction.setBadgeText,
);

/**
 * Scripts that provides javascript plain
 * functions that helps with message communication
 * between content script and background script
 */
const Backend = {
  actions: {},
  registerAction(name, fn, cache = false) {
    // if its backend, register all listeners without patch function
    // it will watch for events from front
    if (isBackgroundScript) {
      this.actions[name] = cache
        ? cacheCall(fn)
        : fn;

      return fn;
    }
    // if its front, patch function to pass function to backend
    return async (...args) => new Promise(
      (resolve) => {
        chrome.runtime.sendMessage(
          {
            type: name,
            args,
          },
          R.compose(
            R.apply(resolve),
            R.of,
            R.prop('data'),
          ),
        );
      },
    );
  },
};

/**
 * Watch events only in background script
 * mode, actions list is dynamic so do not
 * reattach listener after adding any new item
 */
if (isBackgroundScript) {
  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      const backendAction = Backend.actions[request.type];
      if (!backendAction)
        return null;

      const data = backendAction(sender.tab.id, ...request.args);
      if (data && data.then) {
        data.then(
          res => sendResponse({
            data: res,
          }),
        );
      } else {
        sendResponse({
          data,
        });
      }
      return data;
    },
  );
}

/**
 * Generates background method listener
 *
 * @param {string} backgroundFnName
 */
const linkBackendMethod = backgroundFnName => (
  Backend.registerAction(
    backgroundFnName,
    (tabId, ...args) => {
      const fn = chrome.browserAction[backgroundFnName];
      if (!fn)
        return null;

      const [data, ...optArgs] = args;
      return fn.bind(chrome.browserAction)(
        {
          ...data,
          tabId,
        },
        ...optArgs,
      );
    },
  )
);

/**
 * Basic badge functions
 */
export const setBadgeText = R.compose(
  linkBackendMethod('setBadgeText'),
  R.objOf('text'),
  R.unless(
    R.is(String),
    R.toString,
  ),
);

export const setBadgeBackgroundColor = R.compose(
  linkBackendMethod('setBadgeBackgroundColor'),
  R.objOf('color'),
);

/**
 * @todo
 * Find better approach to fix it, do not use globals,
 * single global variable only allows to watch single slot,
 * storing it in array will cause mem leak sometimes
 */
let analyzedFrame = null;

const initResAnalyze = () => ({
  totalRequests: 0,
  size: 0,
});

const initBlankFrameAnalyze = id => ({
  id,
  ...initResAnalyze(),
  details: {
    image: initResAnalyze(),
    script: initResAnalyze(),
    stylesheet: initResAnalyze(),
    media: initResAnalyze(),
    others: initResAnalyze(),
  },
});

let cacheKillerPromise = null;
const killBrowserCache = () => {
  if (cacheKillerPromise)
    return cacheKillerPromise;

  return new Promise((resolve) => {
    const millisecondsPerWeek = 1000 * 60 * 60 * 2;
    const delay = (new Date()).getTime() - millisecondsPerWeek;

    chrome
      .browsingData
      .removeCache(
        {
          since: delay,
        },
        () => {
          cacheKillerPromise = null;
          resolve();
        },
      );
  });
};

export const runOnAnalyzeIdle = Backend.registerAction(
  'runOnAnalyzeIdle',
  () => cacheKillerPromise || Promise.resolve(),
);

export const startFrameAnalyze = Backend.registerAction(
  'startFrameAnalyze',
  analyzedFrameId => (
    killBrowserCache()
      .then(() => {
        analyzedFrame = initBlankFrameAnalyze(analyzedFrameId);
        return analyzedFrame;
      })
  ),
);

export const endFrameAnalyze = Backend.registerAction(
  'endFrameAnalyze',
  () => analyzedFrame,
);

if (isBackgroundScript) {
  /**
   * Increments counters in frame analyze frame
   *
   * @param {ResourceType}  type
   * @param {Number}        size
   * @param {Object}        data
   */
  const hitResourceRequest = (type, size, data) => {
    const detailType = (
      data.details[type]
        ? type
        : 'others'
    );

    return {
      ...data,
      totalRequests: data.totalRequests + 1,
      size: data.size + size,
      details: {
        ...data.details,
        [detailType]: {
          totalRequests: data.details[detailType].totalRequests + 1,
          size: data.details[detailType].size + size,
        },
      },
    };
  };

  const isPreviewFrameID = cacheCall(
    (tabId, frameId) => new Promise((resolve) => {
      if (tabId < 0 || frameId < 0) {
        resolve(null);
        return;
      }

      try {
        chrome.tabs.executeScript(
          tabId,
          {
            frameId,
            code: `(function() {
              var frame = window.frameElement;
              if (!frame)
                return null;

              return frame.getAttribute("${IFRAME_ANALYZE_ATTRIBUTE}");
            })();`,
            matchAboutBlank: true,
          },
          result => resolve(result && result[0]),
        );
      } catch (e) {
        resolve(null);
      }
    }),
  );

  /**
   * Checks if frame that requested resource contains
   * analyze attriute, if true - check its size
   *
   * @param {Object}  event
   */
  const interceptFrameRequests = async (e) => {
    if (!analyzedFrame || e.frameId <= 0)
      return;

    const analyzedId = await isPreviewFrameID(
      e.tabId,
      e.frameId,
    );
    if (!analyzedId)
      return;

    const size = pickContentLength(e.responseHeaders);
    analyzedFrame = hitResourceRequest(
      e.type,
      size,
      analyzedFrame,
    );
  };

  chrome.webRequest.onHeadersReceived.addListener(
    interceptFrameRequests,
    {
      urls: ['<all_urls>'],
    },
    ['responseHeaders'],
  );
}

export default Backend;
