import React, { useEffect, useState, useCallback } from 'react';
import {FlatList, Platform, View, ActivityIndicator, StyleSheet, Button, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ProductItem from '../../components/shop/ProductItem'
import * as cartActions from '../../store/action/cart'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/action/product';

const ProductOverviewScreen = props => {
    const dispatch = useDispatch();

    const[isLoading, setIsLoading] = useState(false);
    const[isRefreshing, setIssRefreshing] = useState(false);
    const [error, setError] = useState();
    const {navigation, route} = props;
    const loadProducts = useCallback(async () => {
        setError()
        setIsLoading(true);
        setIssRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts())
        } catch (err) {
            console.log(err.message)
            setError(err.message)
        } finally {
        setIssRefreshing(false);
        setIsLoading(false);
        }
    }, [loadProducts])
    useEffect(() => {
        const sub = navigation.addListener('willFocus', () => {
            loadProducts();
        });
        return () => {
            navigation.removeListener(sub);
        }
    }, [])
    useEffect(() => {
            loadProducts();
        }, []);
    navigation.setOptions({
        headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title="Menu" iconName={Platform.OS === 'android'? 'md-menu' : 'ios-menu'}
            onPress={() => navigation.toggleDrawer()}/>
        </HeaderButtons>
    })
    const products = useSelector(state => state.products.availableProducts);
    const selectItemHandler = (id, title) => {
        navigation.navigate({name: 'ProductDetail', params: {
            productId: id,
            productTitle: title
        }})
    }
    if(error) {
        return <View style={styles.centered}>
            <Text>An error occured!</Text>
            <Button title='Try again' onPress={loadProducts} color={Colors.primary}/>
        </View>
    }
    if(isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary}/>
        </View>
    }
    if(!isLoading && products.length === 0) {
        return <View style={styles.centered}>
            <Text>No products found</Text>
        </View>
    }
    return <FlatList 
    refreshing={isRefreshing}
    onRefresh={loadProducts}
    data={products}
    renderItem={(data) => {
    return <ProductItem image={data.item.imageUrl} title={data.item.title}
     price={data.item.price} onSelect={() => {
        selectItemHandler(data.item.id, data.item.title);
     }} >
        <Button title="View Details" onPress={() => selectItemHandler(data.item.id, data.item.title)} color={Colors.primary}/>
        <Button title="To Cart" onPress={() => {dispatch(cartActions.addToCart(data.item))}} color={Colors.primary}/>
     </ProductItem>
    }}
    />
}
const styles = StyleSheet.create({
    centered : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default ProductOverviewScreen;