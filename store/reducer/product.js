import PRODUCTS from '../../data/dummy-data';
import { DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, SET_PRODUCT } from '../action/product';
import Product from '../../models/product';
const initialState = {
    availableProducts: [],
    userProducts: []
};
export default (state = initialState, action) => {
    switch(action.type) {
        case SET_PRODUCT:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts
            }
        case CREATE_PRODUCT:
            const {title, description, imageUrl, price, id, ownerId} = action.productData;
            const newProduct = new Product(id, ownerId, title, imageUrl, description, price);
            return{
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            }
        case UPDATE_PRODUCT:
            const productIndex = state.userProducts.findIndex(prod => prod.id === action.pid);
            console.log('productIndex')
            const userId = state.userProducts[productIndex].ownerId;
            const oldPrice = state.userProducts[productIndex].price;
            const {title:oldTitle, description:oldDescription, imageUrl:oldImageUrl} = action.productData;
            const updatedProduct = new Product(action.pid, userId, oldTitle, oldImageUrl, oldDescription, oldPrice );
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[productIndex] = updatedProduct;
            const availableProductIndex = state.availableProducts.findIndex(prod => prod.id === action.pid);
            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[availableProductIndex] = updatedProduct;
            
            console.log(state)
            
            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(product => product.id !== action.pid),
                availableProducts: state.availableProducts.filter(product => product.id !== action.pid)
            };
    }
    return state;
}