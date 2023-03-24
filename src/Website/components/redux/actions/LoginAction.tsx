import axios from 'axios';
import { Dispatch } from 'react';
//  import { BASE_URL } from '../../url/Api';

export interface UserModel {
  email:string,
  password:string,
  token: string;
  node:{};
}

export interface LoginAction {
  readonly type: 'ON_LOGIN';
  payload: UserModel;
}

export interface ErrorAction {
  readonly type: 'LOGIN_ERROR';
  payload: any;
}

export type UserAction = LoginAction | ErrorAction;

// we need to dispatch action
export const onLogin = (email: string | any, password: string | any) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response =  await  axios.post<UserModel>(`http://localhost:3000/`, {
        email:'superadmin@gmail.com',
        password:'123456',
      },
        {
          headers:
          {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "X-Requested-With"
          }
        })
        

      if (!response) {
        dispatch({
          type: 'LOGIN_ERROR',
          payload: response,
        });
      } else {
        dispatch({
          type: 'ON_LOGIN',
          payload: response.data,
          
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error && error.response && error.response.data && error.response.data.message,
        
      });
    }
  };
};