import {
  combineReducers,
  createStore,
} from 'redux';

import adModule from './adModule';

export {default as adsModule} from './adModule';

export default createStore(
  combineReducers({
    ads: adModule,
  }),
);
