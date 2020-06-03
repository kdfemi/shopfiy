import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {Platform} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import {Ionicons} from '@expo/vector-icons'
import Colors from '../constants/Colors';

import StartupScreen from '../screen/StartupScreen'
import AuthScreen from '../screen/user/AuthScreen'

const Stack = createStackNavigator();

const AuthNavigator  = (props) => {
    const {onAuthenticate} = props
    return <Stack.Navigator >
        <Stack.Screen name="Start">
        {props => <StartupScreen {...props} onAuthenticate={onAuthenticate}/>}
        </Stack.Screen>
        <Stack.Screen name="Auth" options={
            {title: 'Authenticate'} 
        } >
        {props => <AuthScreen {...props} onAuthenticate={onAuthenticate}/>}
        </Stack.Screen>
    </Stack.Navigator>
}
export default AuthNavigator;