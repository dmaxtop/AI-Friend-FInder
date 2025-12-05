const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_PROFILE_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null
      };
    case 'UPDATE_PROFILE_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;
