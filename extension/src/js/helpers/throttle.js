import * as R from 'ramda';

export default R.curry(
  (timeout, fn) => {
    let timer = null;

    return (...args) => {
      if (!R.isNil(timer))
        clearTimeout(timer);

      timer = setTimeout(
        () => fn(...args),
        timeout,
      );
    };
  },
);
