import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { post } from '../../../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL, ADMIN_ROLE } from '../../../helpers/config';

let userInfo: any = {};

export const onLogin = createAsyncThunk(
  'auth/loginAction',

  async (user: any, thunkAPI) => {
    let userName = user.userName;
    let password = user.password;
    const response = await post(BASE_URL + '/auth/login', {
      userName,
      password,
    });

    if (response.status) {
      userInfo = response && response.data;
      userInfo.token = response.token;
      const roleId = userInfo && userInfo.roleId;
      console.log('roles', roleId);
      if (roleId === ADMIN_ROLE) {
        sessionStorage.setItem('userToken', response && response.token);
        toast.success(response.message, {
          position: toast.POSITION.TOP_CENTER,
          className: 'toast-message',
        });
        return userInfo;
      } else {
        toast.error('You Do Not Have Access!', {
          position: toast.POSITION.TOP_CENTER,
          className: 'toast-message',
        });
        return false;
      }
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_CENTER,
        className: 'toast-message',
      });
      return false;
    }
  }
);

export const onSignout = () => async (dispatch) => {
  try {
    return dispatch(signout);
  } catch (e: any) {
    return console.error(e.message);
  }
};

export const LoginSlice = createSlice({
  name: 'login',
  initialState: { entities: userInfo },
  reducers: {
    login: (state, { payload }) => {},
    signout: (state,) => {
      state.entities= {}
    },
  },
  extraReducers: {
    [onLogin.fulfilled.toString()]: (state: any, action: any) => {
      if (action.payload && action.payload.token) {
        localStorage.setItem('UserToken', action.payload.token);
        state.entities = action.payload;
      }
    },
    [onLogin.rejected.toString()]: (state: any, action: any) => {
      state.entities = action.payload;
    },
  },
});
export const { login, signout } = LoginSlice.actions;

export default LoginSlice.reducer;
