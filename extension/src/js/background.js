import * as R from 'ramda';
import cacheCall from './helpers/cacheCall';

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
  registerAction(name, fn) {
    // if its backend, register all listeners without patch function
    // it will watch for events from front
    if (isBackgroundScript) {
      this.actions[name] = cacheCall(fn);
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
        return;

      sendResponse({
        data: backendAction(sender.tab.id, ...request.args),
      });
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

export default Backend;
