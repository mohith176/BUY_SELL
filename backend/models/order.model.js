// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//   buyerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   sellerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   hashedOtp: {
//     type: String,
//     required: true
//   },
//   itemId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Item',
//     required: true
//   },
// }, {
//   timestamps: true
// });

// const Order = mongoose.model('Order', orderSchema);

// export default Order;

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  hashedOtp: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;