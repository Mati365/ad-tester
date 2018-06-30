import React from 'react';
import * as R from 'ramda';

export default (assignedProps, override = false) => (Component) => {
  const assignProps = (props) => {
    const parsedProps = (
      R.is(Function, assignedProps)
        ? assignedProps(props)
        : assignedProps
    );

    if (override) {
      return {
        ...props,
        ...parsedProps,
      };
    }

    return {
      ...parsedProps,
      ...props,
    };
  };

  const Wrapped = props => (
    <Component {...assignProps(props)} />
  );

  Wrapped.displayName = 'withProps()';

  return Wrapped;
};
