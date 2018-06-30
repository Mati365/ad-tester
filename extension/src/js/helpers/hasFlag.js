import * as R from 'ramda';

export const addFlag = R.curry(
  (flag, number) => number | flag,
);

export const removeFlag = R.curry(
  (flag, number) => number & (~flag),
);

export default R.curry(
  (flag, number) => (number & flag) === flag,
);
