export * from './selectors';

export const Actions = {
  registerAd: id => ({
    type: 'REGISTER_AD',
    id,
  }),

  editAd: (id, data) => ({
    type: 'EDIT_AD',
    id,
    ...data,
  }),

  blurAd: () => ({
    type: 'BLUR_AD',
  }),

  focusAd: (id, updateData = {}) => ({
    type: 'FOCUS_AD',
    id,
    updateData,
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

    FOCUS_AD: (state, {id, updateData}) => ({
      ...state,
      active: id,
      codes: {
        ...state.codes,
        [id]: {
          ...state.codes[id],
          ...updateData,
        },
      },
    }),

    REGISTER_AD: (state, {id}) => ({
      ...state,
      codes: {
        ...state.codes,
        [id]: {
          code: '',
          dimensions: null,
        },
      },
    }),

    EDIT_AD: (state, {id, ...fields}) => {
      const ad = state.codes[id];
      return {
        ...state,
        active: id,
        codes: {
          ...state.codes,
          [id]: {
            ...ad,
            ...fields,
          },
        },
      };
    },
  },
);
