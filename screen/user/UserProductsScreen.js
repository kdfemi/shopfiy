import React, { useEffect, useCallback } from 'react';
import {FlatList, Button, Alert, View, Text} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/action/product'
const UserProductsScreen = props => {
    const userProduct = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    const editProductHandler = useCallback((id) => {
        props.navigation.navigate({name: 'EditProducts', params: {
            productId: id
        }})
    }, [userProduct])

    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you really want to Delete this Item?', 
        [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive',  onPress: () => {
                dispatch(productsActions.deleteProduct(id))
            }}
    ])
    }

    if(userProduct.length === 0) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No products found, maybe start creating some?</Text>
        </View>
    }
    return <FlatList data={userProduct} keyExtractor={(item, index) => item.id}
    renderItem={ (data) => {
        const item = data.item;
    return <ProductItem image={item.imageUrl} title={item.title} price={item.price}
    onSelect={() => editProductHandler(item.id)}>
        <Button title="Edit" onPress={() => editProductHandler(item.id)} color={Colors.primary}/>
        <Button title="Delete" onPress={() => deleteHandler(item.id)} color={Colors.primary}/>
    </ProductItem>
}}
    />
};

export default UserProductsScreen;