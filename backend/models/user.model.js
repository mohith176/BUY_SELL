import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9]+\.)?iiit\.ac\.in$/, 'Please fill a valid IIIT email address']
    },
    age: {
        type: Number,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    sellerReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTY4ZmU3ZTI1YmYxM2U5NmJjYTkzNSIsImVtYWlsIjoiZC5lQHMuaWlpdC5hYy5pbiIsImlhdCI6MTczODk2OTA2MywiZXhwIjoxNzM4OTcyNjYzfQ.Z0QfKgQyIy5dQcNFfQs6Mxcy7CKZB-_Ra9hwWCilrXQ
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTY5MGVmZDU4OTlkODJlNGUxZTkyOCIsImVtYWlsIjoiZS5mQHMuaWlpdC5hYy5pbiIsImlhdCI6MTczODk2OTMyNywiZXhwIjoxNzM4OTcyOTI3fQ.QaOiCvquX01YvHcmCY64NASfca4i2Pr-7uoR8wtQyu0