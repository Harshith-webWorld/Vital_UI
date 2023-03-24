import { combineReducers } from 'redux';






const rootReducer = combineReducers({

//some more reducer will come
});

export type ApplicationState = ReturnType<typeof rootReducer>;

export default  rootReducer ;