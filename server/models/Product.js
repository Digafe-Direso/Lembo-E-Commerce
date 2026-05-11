// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Product name is required'],
//     trim: true
//   },
//   price: {
//     type: Number,
//     required: [true, 'Price is required'],
//     min: 0
//   },
//   description: {
//     type: String,
//     required: [true, 'Description is required']
//   },
//   category: {
//     type: String,
//     required: [true, 'Category is required'],
//     enum: ['Electronics', 'Fashion', 'Books', 'Home', 'Sports', 'Beauty', 'Toys']
//   },
//   image: {
//     type: String,
//     default: 'https://via.placeholder.com/300'
//   },
//   stock: {
//     type: Number,
//     required: true,
//     default: 0,
//     min: 0
//   },
//   ratings: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 5
//   },
//   numReviews: {
//     type: Number,
//     default: 0
//   },
//   featured: {
//     type: Boolean,
//     default: false
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
// }, { timestamps: true });

// const Product = mongoose.model('Product', productSchema);
// export default Product;
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Fashion', 'Books', 'Home', 'Sports', 'Beauty', 'Toys']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  ratings: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;