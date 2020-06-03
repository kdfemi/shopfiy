import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        try {
            const date = new Date();
            const response = await fetch(`https://ng-react-native.firebaseio.com/orders/${userId}.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartItems,
                    totalAmount,
                    date: date.toISOString()
                })
            });
            const resData = await response.json();
            dispatch({type: ADD_ORDER,
                orderData: {id: resData.name, items: cartItems, amount: totalAmount, date}})
        } catch(err) {

        }
        
    };
};

export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        try {
            const date = new Date();
            const response = await fetch(`https://ng-react-native.firebaseio.com/orders/${userId}.json?auth=${token}`);
            const resData = await response.json();
            const loadedOrders = [];
            for(const key in resData) {
                console.log('HELP')
                const {cartItems, totalAmount, date} =  resData[key]
                loadedOrders.push(new Order(
                    key,
                    cartItems,
                    totalAmount,
                    new Date(date)))
            }
            dispatch({type: SET_ORDERS,
                orders: loadedOrders
            });
        } catch(err) { 
            // throw err;
        }
        
    };
};