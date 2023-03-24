import { combineReducers } from 'redux';
import { LoginReducer } from './LoginReducer';





const rootReducer = combineReducers({
  
  login: LoginReducer,
  
  //some more reducer will come
});

export type ApplicationState = ReturnType<typeof rootReducer>;

export { rootReducer };