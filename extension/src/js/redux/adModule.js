import * as R from 'ramda';

export const Actions = {
  registerAd: id => ({
    type: 'REGISTER_AD',
    id,
  }),

  editAd: (id, code = '') => ({
    type: 'EDIT_AD',
    id,
    code,
  }),

  blurAd: () => ({
    type: 'BLUR_AD',
  }),

  focusAd: id => ({
    type: 'FOCUS_AD',
    id,
  }),
};

const makeReducer = (initialState, mutations) => (state = initialState, action) => {
  const fn = mutations[action.type];
  if (!fn)
    return state;

  return fn(state, action);
};

export default makeReducer(
  {
    codes: {},
    active: null,
  },
  {
    BLUR_AD: state => ({
      ...state,
      active: null,
    }),

    FOCUS_AD: (state, {id}) => ({
      ...state,
      active: id,
    }),

    REGISTER_AD: (state, {id}) => ({
      ...state,
      codes: {
        ...state.codes,
        [id]: '',
      },
    }),

    EDIT_AD: (state, {id, code}) => ({
      ...state,
      active: id,
      codes: {
        ...state.codes,
        [id]: R.defaultTo(state.codes[id], code),
      },
    }),
  },
);
