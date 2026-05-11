import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/User.js';
import Product from './models/Product.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create Admin User
    const adminSalt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin123456', adminSalt);
    
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      isActive: true
    });
    console.log('✅ Admin user created: admin@example.com / Admin123456');

    // Create Regular User
    const userSalt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash('User123456', userSalt);
    
    const user = await User.create({
      name: 'Demo User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      isActive: true
    });
    console.log('✅ Demo user created: user@example.com / User123456');

    // Create Sample Products
    const products = [
      {
        name: 'iPhone 15 Pro',
        price: 999,
        description: 'Latest Apple smartphone with A17 Bionic chip and titanium design',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=300',
        stock: 50,
        featured: true,
        ratings: 4.5,
        numReviews: 120
      },
      {
        name: 'Samsung 4K Smart TV',
        price: 599,
        description: '55-inch 4K Ultra HD Smart TV with HDR10+',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300',
        stock: 30,
        featured: true,
        ratings: 4.3,
        numReviews: 85
      },
      {
        name: 'Nike Air Max',
        price: 129,
        description: 'Comfortable running shoes with Air cushioning technology',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
        stock: 100,
        featured: false,
        ratings: 4.7,
        numReviews: 200
      },
      {
        name: 'JavaScript: The Good Parts',
        price: 29,
        description: 'Essential JavaScript book for developers',
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300',
        stock: 200,
        featured: true,
        ratings: 4.8,
        numReviews: 500
      },
      {
        name: 'Sony Noise Cancelling Headphones',
        price: 299,
        description: 'Industry-leading noise cancellation with 30-hour battery life',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300',
        stock: 45,
        featured: false,
        ratings: 4.6,
        numReviews: 150
      },
      {
        name: 'Leather Jacket',
        price: 199,
        description: 'Premium genuine leather jacket for men',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac1?w=300',
        stock: 25,
        featured: true,
        ratings: 4.4,
        numReviews: 75
      },
      {
        name: 'The Midnight Library',
        price: 19,
        description: 'Bestselling novel by Matt Haig',
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
        stock: 150,
        featured: false,
        ratings: 4.9,
        numReviews: 300
      },
      {
        name: 'Dyson Cordless Vacuum',
        price: 499,
        description: 'Powerful cordless vacuum cleaner with advanced filtration',
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300',
        stock: 20,
        featured: true,
        ratings: 4.5,
        numReviews: 60
      }
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added successfully`);

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin: admin@example.com / Admin123456');
    console.log('   User: user@example.com / User123456');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();