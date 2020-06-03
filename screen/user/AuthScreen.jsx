import React, {useReducer, useCallback, useState, useEffect} from 'react';
import {ScrollView, View, KeyboardAvoidingView, StyleSheet, Alert, 
    Button, ActivityIndicator} from 'react-native'
import Input from '../../components/UI/Input'
import Card from '../../components/UI/Card'
import Colors from '../../constants/Colors';
import {LinearGradient} from 'expo-linear-gradient'
import {useDispatch} from 'react-redux';
import * as authActions from '../../store/action/auth'


const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
    if(action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }
        const updatedValidities = {
            ...state.inputValidities,
            [action.input] : action.isValid
        }
        let formIsValid = true;
        for(const key in updatedValidities) {
            formIsValid = formIsValid && updatedValidities[key]
        }
        return {
            formIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        }
    }
    return state;
};

const AuthScreen = props => {
    // console.log()
    const {navigation, route} = props;
    const [isSignUp, setIsSignUp ] = useState(false);
    const [isLoading, setIssLoading ] = useState(false);
    const [error, setError ] = useState(null);
    const dispatch = useDispatch();
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        }, inputValidities: {
            email: false,
            password: false
        }, formIsValid: false});

        useEffect(() => {
            if(error) {
                Alert.alert('An Error Occurred!', error, [{
                    onPress: () => setError(null),
                    text: 'Ok'
                }]);
            } 
            return () => {};
        }, [error]);

        const authHandler = async () => {
            setIssLoading(true);
            setError(null);
            try {
                if(isSignUp) {
                    await dispatch(authActions.signup(formState.inputValues.email, formState.inputValues.password));
                } else {
                    await dispatch(authActions.signin(formState.inputValues.email, formState.inputValues.password));
                }
                props.onAuthenticate(true);
            } catch (err) {
                setError(err.message);
                setIssLoading(false);
            } 
        }
        const inputChangeHandler =  useCallback((inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({type: FORM_INPUT_UPDATE, value: inputValue, isValid: inputValidity, input: inputIdentifier}) 
        }, [dispatchFormState]);
    return (
        <KeyboardAvoidingView  behavior="padding"
        keyboardVerticalOffset={50}
        style={styles.screen}>
            <LinearGradient colors={['#ffedff', '#ffe3ff']}
            style={styles.gradient}>
            <Card style={styles.authContainer}>
                <ScrollView>
                    <Input id="email" label="E-Mail" required email
                    errorText="Please enter a valid email address."
                    autoCapitalize="none" onInputChange={inputChangeHandler}
                    initialValue=""
                    keyboardType="email-address"/>
                    <Input id="password" label="Password" required
                    errorText="Please enter a valid password"
                    autoCapitalize="none" onInputChange={inputChangeHandler}
                    initialValue="" secureTextEntry minLength={6}
                    keyboardType="default"/>
                     {isLoading?<ActivityIndicator style={styles.spinner} color={Colors.primary} size="large" />: (
                        <View >
                        <View style={styles.buttonContainer}>
                            <Button title={isSignUp? "Sign Up" : "Login"} 
                            color={Colors.primary} onPress={authHandler}/>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title={`Switch to ${isSignUp? "Login": "Sign Up"}`}
                            color={Colors.accent} onPress={() => {
                                setIsSignUp( prevState => !prevState);
                            }}/>   
                        </View>
                        </View>
                     )}
                </ScrollView>
            </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        padding: 20,
        maxHeight: 400
    },
    spinner: {
        marginTop: 10
    },
    buttonContainer: {
        marginTop: 10
    }
})

export default AuthScreen;