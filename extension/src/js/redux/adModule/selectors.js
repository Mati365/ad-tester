import * as R from 'ramda';

export const adSelector = R.curry(
  (id, state) => state.codes[id] || {},
);

export const adCodeSelector = R.compose(
  R.propOr('', 'code'),
  adSelector,
);

export const activeAdSelector = state => adSelector(state.active, state);
export const activeAdCodeSelector = state => activeAdSelector(state).code;
