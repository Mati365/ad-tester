import React from 'react';
import * as R from 'ramda';

export default omitProps => (Component) => {
  const Wrapped = props => (
    <Component {...R.omit(omitProps, props)} />
  );

  Wrapped.displayName = 'omitProps()';

  return Wrapped;
};
