import React, { useEffect, useState } from 'react';
import {View, FlatList, StyleSheet, Platform, ActivityIndicator, Text} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/action/order'
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
    const {navigation, route} = props;
    const [isLoading, setIsLoading] = useState(false); 
    navigation.setOptions({
        headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title="Menu" iconName={Platform.OS === 'android'? 'md-menu' : 'ios-menu'}
            onPress={() => navigation.toggleDrawer()}/>
        </HeaderButtons>
    });
    const disptach = useDispatch();
    useEffect(() => {
        setIsLoading(true)
        disptach(ordersActions.fetchOrders())
        .then(() => {
            setIsLoading(false)
        })
    }, [])
    const orders = useSelector(state => state.orders.orders);
    if(isLoading) {
        return <View style={style.centered}>
            <ActivityIndicator color={Colors.primary} size='large'/>
        </View>
    }
    if(orders.length === 0) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No orders found, maybe start ordering some orders?</Text>
        </View>
    }
    return <FlatList data={orders} 
    onRefresh={() => ordersActions.fetchOrders()}
    refreshing={isLoading}
    renderItem={ data => <OrderItem date={data.item.readableDate} items={data.item.items} amount={data.item.totalAmount}/>}/>
}

const style = StyleSheet.create({
    centered: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
export default OrdersScreen;