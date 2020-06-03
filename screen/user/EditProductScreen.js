import React, { useEffect, useCallback, useReducer, useState } from 'react';
import {View, StyleSheet, ScrollView, KeyboardAvoidingView, Alert,
ActivityIndicator} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as productsActions from '../../store/action/product';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors'

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
const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState();
    const {navigation, route} = props;
    const dispatch = useDispatch()
    const prodId = route.params && route.params.productId;
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prodId === prod.id))
    useEffect(() => {
        if(isError) {
            Alert.alert('An error occured', isError, ['ok'])
        }
    }, [isError]);
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct? editedProduct.title : '',
            imageUrl: editedProduct? editedProduct.imageUrl : '',
            description: editedProduct? editedProduct.description : '',
            price: ''
        }, inputValidities: {
            title: editedProduct? true: false,
            imageUrl: editedProduct? true: false,
            description: editedProduct? true : false,
            price: editedProduct? true :false

        }, formIsValid: editedProduct? true :false})

    const submitHandler = useCallback(async () => {
        if(!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the inputs', ['Ok'])
            return;
        }
        setIsLoading(true);
        setIsError(null);
        try {
            if(editedProduct) {
                await dispatch(productsActions.updateProduct(prodId, formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl));
            } else {
                await dispatch(productsActions.createProduct(formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, +formState.inputValues.price))
            }
            setIsLoading(false);
            navigation.goBack();
        } catch (err) {
            setIsError(err.message);
        }
    }, [dispatch, prodId, formState]);

    useEffect(() => {
        navigation.setParams({submit: submitHandler})
    }, [submitHandler]);

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {

        dispatchFormState({type: FORM_INPUT_UPDATE, value: inputValue, isValid: inputValidity, input: inputIdentifier})
        
    }, [dispatchFormState]);
    if(isLoading) {
        return (<View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary}/>
        </View>)
    }
    return (
        <KeyboardAvoidingView behavior="padding" 
        style={{flex: 1}}
        keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={styles.form}>
                    <Input  autoCapitalize="sentences" autoCorrect returnKeyType="next"
                        errorText="Please enter a valid title" label="Title"
                        keyboardType="default" 
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                        id="title"
                    />

                <Input  autoCapitalize="sentences" autoCorrect returnKeyType="next"
                    errorText="Please enter a valid image url" label="Image url"
                    keyboardType="default"
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct? editedProduct.imageUrl : ''}
                    initiallyValid={!!editedProduct}
                    required
                    id="imageUrl"
                />

                    {!editedProduct && <Input returnKeyType="next"
                        errorText="Please enter a valid price" label="Price"
                        keyboardType="decimal-pad"
                        onInputChange={inputChangeHandler}
                        required
                        min={0.1}
                        id="price"

                    />}

                    <Input  autoCapitalize="sentences" autoCorrect
                        errorText="Please enter a valid title" label="Description"
                        keyboardType="default" multiline
                        numberOfLine={3}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                        id="description"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default EditProductScreen