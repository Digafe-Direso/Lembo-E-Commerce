import mongoose from 'mongoose';

const userActionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  action: {
    type: String,
    enum: ['view', 'click', 'purchase'],
    required: true
  },
  productCategory: String,
  productPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('UserAction', userActionSchema);