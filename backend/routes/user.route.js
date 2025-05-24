import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createUser, updateUser, getUser, deleteUser,loginUser,addItemToCart,getCartItems, removeItemFromCart, placeOrder, getOrdersForSeller, closeTransaction ,getPendingOrders, getBoughtItems, getSoldItems} from '../controllers/user.controller.js';



const router = express.Router();


// Create a new user
router.post('/create', createUser);

// Update an existing user
router.put('/update', protect,updateUser);

// Get a user 
router.get('/get', protect,getUser);

// Delete a user 
router.delete('/delete', protect,deleteUser);

// login user
router.post('/login', loginUser);

// Add item to cart
router.post('/cart/add', protect, addItemToCart);

// Get items from cart
router.get('/cart/get', protect, getCartItems);

// Remove item from cart
router.post('/cart/remove', protect, removeItemFromCart);

// Place order
router.post('/cart/order', protect, placeOrder);

// Get orders for seller
router.get('/orders/seller', protect, getOrdersForSeller);

// Close transaction
router.post('/orders/close', protect, closeTransaction);

// Get pending orders
router.get('/orders/pending', protect, getPendingOrders);

// Get bought items
router.get('/orders/bought', protect, getBoughtItems);

// Get sold items
router.get('/orders/sold', protect, getSoldItems);

export default router;