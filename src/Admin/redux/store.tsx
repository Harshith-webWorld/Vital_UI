import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import  rootReducer  from './reducers'; // root reducer
import logger from 'redux-logger'
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(rootReducer,composeWithDevTools( applyMiddleware(thunk,logger)
));

store.subscribe(() => {});
export default store;
