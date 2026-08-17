import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  role: localStorage.getItem('role') || 'user',
  userId: localStorage.getItem('id') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.role = action.payload?.role || 'user';
      state.userId = action.payload?.id || null;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', state.role);
      if (action.payload?.id) localStorage.setItem('id', action.payload.id);
      if (action.payload?.token) localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.role = 'user';
      state.userId = null;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('id');
      localStorage.removeItem('token');
    },
    changeRole(state, action) {
      state.role = action.payload;
      localStorage.setItem('role', action.payload);
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
