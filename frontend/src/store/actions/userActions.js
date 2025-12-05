// frontend/src/store/actions/userActions.js
export const updateUserProfile = (profileData) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'UPDATE_PROFILE_START' });
    
    const { auth } = getState();
    const token = auth.token || localStorage.getItem('token');
    
    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      dispatch({ 
        type: 'UPDATE_PROFILE_SUCCESS', 
        payload: data.user || data.data?.user 
      });
      return { success: true, user: data.user || data.data?.user };
    } else {
      dispatch({ 
        type: 'UPDATE_PROFILE_FAILURE', 
        payload: data.message || 'Update failed' 
      });
      return { success: false, error: data.message };
    }
  } catch (error) {
    dispatch({ 
      type: 'UPDATE_PROFILE_FAILURE', 
      payload: error.message 
    });
    return { success: false, error: error.message };
  }
};
