import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet, AsyncStorage} from 'react-native'
import Colors from '../constants/Colors';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/action/auth';
const StartupScreen = props => {
    const dispatch = useDispatch();
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if(!userData) {
                props.navigation.navigate('Auth')
                return;
            }
            const transformData = JSON.parse(userData);
            const {token, userId, expiryDate} = transformData;
            const expirationDate = new Date(expiryDate);
    
            if(expirationDate <= new Date() || !token || !userId) {
                props.navigation.navigate('Auth')
              return;
            }
            dispatch(authActions.authenticate(userId, token))
            props.onAuthenticate(true);
        }
        tryLogin();
    }, [dispatch])
    return (
        <View style={styles.screen}>
            <ActivityIndicator size="large" color={Colors.primary}/>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {}
});

export default StartupScreen
