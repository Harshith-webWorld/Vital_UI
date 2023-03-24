import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import Logger from 'redux-logger'
import  adminrootReducer  from '../Admin/adminSlice';
var CryptoJS = require("crypto-js");
var key = "my secret key 123";


const loadFromSessionStorage = () => {
  try {
    const stateStr = window.sessionStorage.getItem('state');
    // if(!stateStr === null){
      var bytes  = CryptoJS.AES.decrypt(stateStr, key);
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData ? decryptedData : undefined;
    // }
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const persistedStore = loadFromSessionStorage();
const preloadedState = persistedStore;

export const store = configureStore({
  reducer: {
         Admin:adminrootReducer,
      },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(Logger),
  preloadedState
})
const saveToSessionStorage = (state) => {
  try {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(state), key).toString();
    window.sessionStorage.setItem('state', ciphertext);
  } catch (e) {
    console.error(e);
  }
};



store.subscribe(() => {
  saveToSessionStorage(store.getState());
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;




