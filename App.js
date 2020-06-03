import React, { useState, useCallback } from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import * as Fonts from 'expo-font';
import {AppLoading} from 'expo';
import ReduxThunk from 'redux-thunk';
import ShopNavigator from './navigation/ShopNavigator';
import productReducer from './store/reducer/product';
import cartReducer from './store/reducer/cart';
import orderReducer from './store/reducer/order';
import AuthNavigator from './navigation/AuthNavigator';
import AuthReducer from './store/reducer/auth'
const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  orders: orderReducer,
  auth: AuthReducer
})
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const loadFonts = () => {
  return Fonts.loadAsync({
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf')
  })
};

export default function App() {
  const [isFontLoaded, setFontLoaded] = useState(false)
  const [isAuth, setIsAuth] = useState(false);
  const CheckAuth = useCallback((authState) => {
    console.log(authState);
    setIsAuth(authState);
  }, [])
  if(!isFontLoaded) {
    return <AppLoading startAsync={loadFonts} onFinish={() => setFontLoaded(true)}/>
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        {isAuth? 
        <ShopNavigator/> :
        <AuthNavigator onAuthenticate={setIsAuth}/>
        }
      </NavigationContainer>
    </Provider>
  );
}
