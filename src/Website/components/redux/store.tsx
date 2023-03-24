import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers'; // root reducer
import logger from 'redux-logger'

const store = createStore(rootReducer, applyMiddleware(thunk,logger));

store.subscribe(() => {});
export default store;