import React, { useEffect } from 'react';
import {ScrollView, View, Text, Image,
    StyleSheet, Button} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../../constants/Colors';
import * as cartActions from '../../store/action/cart'


const ProductDetailScreen = props => {
    const {navigation, route} = props;
    const productId = route.params.productId;
    const selectedProduct = useSelector(state => state.products.availableProducts.find( prod => prod.id === productId))
    const dispatch = useDispatch()
    useEffect(() => {
        navigation.setOptions({
            title: route.params.productTitle
        });
    }, [selectedProduct])
    return (
        <ScrollView>
            <Image style={styles.image} source={{uri: selectedProduct.imageUrl}}/>
            <View style={styles.actions}>
            <Button title="Add to cart" onPress={() => {dispatch(cartActions.addToCart(selectedProduct))}} color={Colors.primary}/>
            </View>
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center'
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'open-sans-bold'
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20,
        fontFamily: 'open-sans'
    }
});

export default ProductDetailScreen;