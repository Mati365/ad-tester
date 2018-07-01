import React from 'react';
import {Provider} from 'react-redux';

import store from '../redux/store';

export default (Component) => {
  const Wrapped = props => (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );

  Wrapped.displayName = 'withAppStore()';

  return Wrapped;
};
