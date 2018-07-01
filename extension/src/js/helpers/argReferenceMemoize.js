import * as R from 'ramda';

/**
 * Caches function and memoize return, compares only with
 * previous arguments, it does shallow compare only
 *
 * @param {Function} fn
 */
export default function (fn) {
  let prevArgs = null;
  let prevValue = null;

  const argComparator = (value, index) => value === prevArgs[index];

  const equalArgs = args => (
    args.length === prevArgs.length
      && args.every(argComparator)
  );

  return function wrapped(...args) {
    if (R.isNil(prevArgs) || !equalArgs(args, prevArgs)) {
      prevValue = fn(...args);
      prevArgs = args;
    }
    return prevValue;
  };
}
