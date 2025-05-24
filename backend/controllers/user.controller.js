import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Item from '../models/item.model.js';
import Order from '../models/order.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Create new user
export const createUser = async (req, res) => {
    const { firstName, lastName, email, age, contactNumber, password } = req.body;

    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !age || !contactNumber || !password) {
        return res.status(400).json({ message: "Please provide all fields" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ ...req.body, password: hashedPassword });
        const newUser = await user.save();

        // Generate JWT token
        const token = generateToken(newUser);

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update user 
export const updateUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get user
export const getUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const deletedUser = await User.findByIdAndDelete(req.user._id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if all required fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = generateToken(user);
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Add item to cart
export const addItemToCart = async (req, res) => {
    const userId = req.user._id;
    const { itemId } = req.body;

    try {
        const user = await User.findById(userId);
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.sellerId.toString() === userId.toString()) {
            return res.status(400).json({ message: 'You cannot add your own item to the cart' });
        }

        user.cartItems.push(itemId);
        await user.save();

        res.status(200).json({ message: 'Item added to cart', cartItems: user.cartItems });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error });
    }
};


// Get items from cart
export const getCartItems = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate('cartItems');
        res.status(200).json(user.cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart items', error });
    }
};

// Remove item from cart
export const removeItemFromCart = async (req, res) => {
    const userId = req.user._id;
    const { itemId } = req.body;

    try {
        const user = await User.findById(userId);
        user.cartItems = user.cartItems.filter(item => item.toString() !== itemId);
        await user.save();
        res.status(200).json({ message: 'Item removed from cart', cartItems: user.cartItems });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error });
    }
};


// Place order
export const placeOrder = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate('cartItems');
        const items = user.cartItems;

        if (items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const orders = await Promise.all(items.map(async item => {
            const otp = crypto.randomBytes(4).toString('hex');
            const hashedOtp = await bcrypt.hash(otp, 10);

            return {
                buyerId: userId,
                sellerId: item.sellerId,
                itemId: item._id,
                amount: item.price,
                otp, 
                hashedOtp
            };
        }));

        await Order.insertMany(orders);

        user.cartItems = [];
        await user.save();

        res.status(200).json({ message: 'Order placed successfully', orders });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error });
    }
};

// Get orders for seller
export const getOrdersForSeller = async (req, res) => {
    const sellerId = req.user._id;

    try {
        const orders = await Order.find({ sellerId, status: 'pending' })
            .populate('buyerId', 'firstName lastName')
            .populate('itemId', 'name price');
        
        if (!orders) {
            console.error('No orders found for seller:', sellerId);
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

// Close transaction
export const closeTransaction = async (req, res) => {
    const { orderId, otp } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const isMatch = await bcrypt.compare(otp, order.hashedOtp);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // await Order.findByIdAndDelete(orderId);
        order.status = 'completed';
        await order.save();

        res.status(200).json({ message: 'Transaction closed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error closing transaction', error });
    }
};

// Get pending orders for user
export const getPendingOrders = async (req, res) => {
    const userId = req.user._id;

    try {
        const orders = await Order.find({ buyerId: userId, status: 'pending' })
            .populate('itemId', 'name price')
            .populate('sellerId', 'firstName lastName');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ message: 'Error fetching pending orders', error });
    }
};


// Get bought items for user
export const getBoughtItems = async (req, res) => {
    const userId = req.user._id;

    try {
        const orders = await Order.find({ buyerId: userId, status: 'completed' })
            .populate('itemId', 'name price')
            .populate('sellerId', 'firstName lastName');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching bought items:', error);
        res.status(500).json({ message: 'Error fetching bought items', error });
    }
};

// Get sold items for user
export const getSoldItems = async (req, res) => {
    const userId = req.user._id;

    try {
        const orders = await Order.find({ sellerId: userId, status: 'completed' })
            .populate('itemId', 'name price')
            .populate('buyerId', 'firstName lastName');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching sold items:', error);
        res.status(500).json({ message: 'Error fetching sold items', error });
    }
};



// generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};