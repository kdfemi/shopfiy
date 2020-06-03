import {AsyncStorage} from 'react-native';


export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';


export const authenticate = (userId, token) => {
    return {type: AUTHENTICATE, userId, token}
}

export const signup = (email, password) => {
    return async (dispatch) => {
        try {

            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBfjhIIOyfwGo61GsixMnelD6S7d6ILMu8',{
                 method: 'POST',
                 headers: {
                     'Content-type': 'application/json'
                 },
                 body: JSON.stringify({
                     email, password,
                     returnSecureToken: true
                 })
             })
             console.log('DONE Signup')
             if(!response.ok) {
                const err = await response.json()
                 throw new Error(err.error.message);
                }
            const resData = await response.json();
            // dispatch({type: SIGNUP, token: resData.idToken, userId: resData.localId})
            dispatch(authenticate(resData.localId, resData.idToken));
            const expirationDate = new Date(new Date().getTime() + (+resData.expiresIn * 1000));
            saveDateToStorage(resData.idToken, resData.localId, expirationDate);
        } catch (err) {
            if(err) {
                throw new Error(err);
            }
            throw new Error('Something went wrong try again');

        }
    }
}

export const signin = (email, password) => {
    return async (dispatch) => {
        try {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBfjhIIOyfwGo61GsixMnelD6S7d6ILMu8',{
                 method: 'POST',
                 headers: {
                     'Content-type': 'application/json'
                 },
                 body: JSON.stringify({
                     email, password,
                     returnSecureToken: true
                 })
             })
             console.log('DONE Signin')
             if(!response.ok) {
                const err = await response.json()
                 throw new Error(err.error.message);
                }
                const resData = await response.json();
                dispatch(authenticate(resData.localId, resData.idToken));
            // dispatch({type: LOGIN , token: resData.idToken, userId: resData.localId})
                const expirationDate = new Date(new Date().getTime() + (+resData.expiresIn * 1000));
                saveDateToStorage(resData.idToken, resData.localId, expirationDate);
        } catch (err) {
            if(err) {
                throw new Error(err);
            }
            throw new Error('Something went wrong try again');
        }
    }
}

export const logOut = () => {
    return {type: LOGOUT}
}

const saveDateToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({token, userId,
        expiryDate: expirationDate.toISOString()}));
}