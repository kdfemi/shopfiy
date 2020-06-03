import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer'
import {Platform, SafeAreaView, Button, View} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import {Ionicons} from '@expo/vector-icons'

import Colors from '../constants/Colors';

import ProductsOverviewScreen from '../screen/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screen/shop/ProductDetailScreen';
import CustomHeaderButton from '../components/UI/HeaderButton';
import CartScreen from '../screen/shop/CartScreen';
import OrdersScreen from '../screen/shop/OrdersScreen';
import UserProductsScreen from '../screen/user/UserProductsScreen';
import EditProductScreen from '../screen/user/EditProductScreen';
import AuthScreen from '../screen/user/AuthScreen'
import {useDispatch} from 'react-redux'
import * as authActions from '../store/action/auth';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//#region ProductsNavigator
const ProductsNavigator = () => {
    return (
    <Stack.Navigator screenOptions={defaultHeaderStyle}>
        <Stack.Screen name="ProductsOverview" component={ProductsOverviewScreen}
            options={ (props) => (
                {
                    title: "All Products",
                    headerRight: headerButtonProps => {
                        return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                            <Item iconName={Platform.OS === 'android'? 'md-cart': 'ios-cart'}
                            title="cart" onPress={() => {props.navigation.navigate('Cart')}}/>
                        </HeaderButtons>
                    }
            })}
        />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen}/>
        <Stack.Screen name="Cart" component={CartScreen} options={{
            title: 'Your Cart'
        }}/>
    </Stack.Navigator>
    );
}
//#endregion

//#region OrdersNavigator
const OrdersNavigator = () => {
    return (
        <Stack.Navigator screenOptions={defaultHeaderStyle}>
            <Stack.Screen component={OrdersScreen} name="Orders" options={{
                title: 'Your Orders'
                }}></Stack.Screen>
        </Stack.Navigator>
    );
}
//#endregion

//#region userNavigator
const AdimNavigator = () => {
    return (
        <Stack.Navigator screenOptions={defaultHeaderStyle}>
            <Stack.Screen component={UserProductsScreen} name="UserProducts"
            options={ props => ({
                title: 'Your Products',
                headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title="Menu" iconName={Platform.OS === 'android'? 'md-menu' : 'ios-menu'}
                onPress={() => props.navigation.toggleDrawer()}/>
                </HeaderButtons>,
                headerRight: (headerProps) => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title="Add" iconName={Platform.OS === 'android'? 'md-create' : 'ios-create'}
                onPress={() => props.navigation.navigate('EditProducts')}/>
                </HeaderButtons>
                })} ></Stack.Screen>

        <Stack.Screen component={EditProductScreen} name="EditProducts" options={ props => ({
                title: (props.route.params && props.route.params.productId) ? 'Edit Product' : 'Add Product',
                headerRight: (headerProps) => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title="Save" iconSize={32} iconName={Platform.OS === 'android'? 'md-checkmark' : 'ios-checkmark'}
                onPress={() => props.route.params.submit()}/>
                </HeaderButtons>
                })} ></Stack.Screen>
        </Stack.Navigator>
    );
}
//#endregion

//#region DrawerNavigator
const DrawerNavigator = (props, context) => {
    const dispatch = useDispatch();
  
    return (
        <Drawer.Navigator screenOptions={defaultHeaderStyle}
        drawerContentOptions={{
            activeTintColor: Colors.primary
        }} 
        drawerContent= { props => {
                    console.log(props)
            return <View style={{flex: 1, paddingTop: 20}}>
                <SafeAreaView >
                    <DrawerItemList {...props}/>
                    <Button title="Logout" color={Colors.primary} onPress={() => {
                        dispatch(authActions.logOut());
                        // props.navigation.navigate('Auth')
                    }}/>
                </SafeAreaView>
            </View>
        }}
        >
            <Drawer.Screen component={ProductsNavigator} name="Products" options={{
                drawerIcon: drawConfig => <Ionicons size={23}
                color={drawConfig.color} 
                 name={Platform.OS === 'android' ? 'md-list' : 'ios-list'} />
            }}></Drawer.Screen>

            <Drawer.Screen component={OrdersNavigator} name="Order" options={{
                drawerIcon: drawConfig => <Ionicons size={23}
                color={drawConfig.color} 
                 name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} />
            }} ></Drawer.Screen>

            <Drawer.Screen component={AdimNavigator} name="Admin" options={{
                drawerIcon: drawConfig => <Ionicons size={23}
                color={drawConfig.color} 
                 name={Platform.OS === 'android' ? 'md-create' : 'ios-create'} />
            }} ></Drawer.Screen>
        </Drawer.Navigator>
    );

}
//#endregion

//#region StackNavigator default headerStyle
const defaultHeaderStyle = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android'? Colors.primary : ''
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS === 'android'? 'white' : Colors.primary
}
//#endregion

// //#region  Auth Navigator
// const AuthNavigator  = () => {
//     return <Stack.Navigator >
//         <Stack.Screen name="Auth" component={AuthScreen} options={
//             {title: 'Authenticate'} 
//         } />
//     </Stack.Navigator>
// }
// //#endregion

// //#region  Main Navigator
// const MainNavigator = (props) => {
    
//     let Navigator = <AuthNavigator/>;
//     if(props.isAuth === true) {
//         let Navigator = <DrawerNavigator/>;
//     }
//     return Navigator;
   
// }
//#endregion

export default DrawerNavigator;