// src/store/reducer/authReducer.js
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    /* ───── LOGIN / REGISTER ───── */
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, loading: true, error: null };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
        isAuthenticated: true,
      };

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return { ...state, loading: false, error: action.payload };

    /* ───── PROFILE UPDATE ───── */
    case 'UPDATE_PROFILE_START':
      return { ...state, loading: true, error: null };

    case 'UPDATE_PROFILE_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };

    case 'UPDATE_PROFILE_FAILURE':
      return { ...state, loading: false, error: action.payload };

    /* ───── LOGOUT ───── */
    case 'LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
};

export default authReducer;
