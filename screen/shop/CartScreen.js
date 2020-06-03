import React, {useState} from 'react';
import {View, Text, FlatList, Button, StyleSheet, ActivityIndicator} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/action/cart'
import * as ordersActions from '../../store/action/order'
import Card from '../../components/UI/Card';

const CartScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        const items = state.cart.items;
        for (const key in  items) {
            transformedCartItems.push({
                productId: key,
                productTitle: items[key].productTitle,
                productPrice: items[key].productPrice,
                quantity: items[key].quantity,
                sum: items[key].sum
            })
        }
        return transformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1);
    });
    const dispatch = useDispatch();

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>Total:  
                <Text style={styles.amount}> ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}</Text></Text>
                {isLoading? <ActivityIndicator size="small" color={Colors.primary}/> :
                <Button title="Order Now" color={Colors.accent}
                disabled={cartItems.length === 0} 
                onPress={async () => { 
                    setIsLoading(true);
                    await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount))
                    setIsLoading(false);
                }}
               />
                
                }
            </Card>
            <View>
                <FlatList data={cartItems}
                 keyExtractor={(item, index) => item.productId}
                 renderItem={(itemData) => <CartItem deletable quantity={itemData.item.quantity} 
                 title={itemData.item.productTitle} amount={itemData.item.sum}
                 onRemove={ async () => { 
                     await dispatch(cartActions.removeFromCart(itemData.item.productId))
                    }}
                 />}
                 />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        margin: 20,
    },
    summary: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    }
});

export default CartScreen;