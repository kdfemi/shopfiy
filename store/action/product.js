import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCT = 'SET_PRODUCT';

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch('https://ng-react-native.firebaseio.com/products.json');
            const resData = await response.json();
            const loadedProduct = [];
            for(const key in resData) {
                const {title, price, imageUrl, description, ownerId} =  resData[key]
                loadedProduct.push(new Product(key, ownerId, title, imageUrl, description, price))
            }
            dispatch({type: SET_PRODUCT, products: loadedProduct,
                 userProducts: loadedProduct.filter(prod => prod.ownerId === userId)}) ;
        } catch (err) {
            throw err;
        }
    }
}

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        try {
            await fetch(
            `https://ng-react-native.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE'
            });
            dispatch ({type: DELETE_PRODUCT, pid: productId});
        } catch(err) {
            throw err;
        }
    }
};

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`https://ng-react-native.firebaseio.com/products.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl,
                    price,
                    ownerId: userId
                })
            });
            const resData = await response.json();
            dispatch({type: CREATE_PRODUCT, productData: {
                id: resData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            }});

        } catch (err) {

        }
    }

};

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
      try {  
          const response = await fetch(
            `https://ng-react-native.firebaseio.com/products/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl
            })
        });
        dispatch({
            type: UPDATE_PRODUCT, 
            pid: id,
            productData: {
            title,
            description,
            imageUrl
        }})
    } catch (err) {
        throw err
        }
    };
}