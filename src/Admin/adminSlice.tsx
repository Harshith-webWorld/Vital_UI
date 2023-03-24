import { combineReducers } from 'redux';
import Login from './components/Login/loginslice';
import signinSlice from '../Website/components/WebLogin/siginslice';






const adminrootReducer = combineReducers({
    login: Login,
    signin: signinSlice,
    //some more reducer will come
});

export type ApplicationState = ReturnType<typeof adminrootReducer>;

export default adminrootReducer;