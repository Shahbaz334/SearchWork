import { configureStore, combineReducers, createStore } from '@reduxjs/toolkit'
import navReducer from './src/redux/slices';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

let rootReducer = combineReducers({
  nav: navReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const reduxStore = () => {
  let store = createStore(persistedReducer);
  let persistor = persistStore(store);
  return {store, persistor}
}

export default reduxStore;



