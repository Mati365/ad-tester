import * as R from 'ramda';

/**
 * Caches function, call it only when arg change.
 * Instead R.memoizeWith it doesnt generate any keys,
 * just check if previous args are equal to current
 *
 * Function params have to be serializable!
 *
 * @param {Function} fn
 */
const cacheCall = (fn) => {
  let previousArgs = null;
  let previousReturn = null;

  return (...args) => {
    if (!R.isNil(previousArgs) && R.equals(previousArgs, args))
      return previousReturn;

    previousReturn = fn(...args);
    previousArgs = args;
    return previousReturn;
  };
};

export default cacheCall;
