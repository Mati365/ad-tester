import * as R from 'ramda';

export default R.compose(
  ({value}) => +value,
  R.defaultTo({value: 0}),
  R.find(
    item => R.toLower(item.name) === 'content-length',
  ),
);
