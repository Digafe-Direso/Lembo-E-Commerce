import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);

async function createTestUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('✅ Cleared existing users');

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

    // Create another test user
    const testSalt = await bcrypt.genSalt(10);
    const testPassword = await bcrypt.hash('Test123456', testSalt);
    
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: testPassword,
      role: 'user',
      isActive: true
    });
    console.log('✅ Test user created: test@example.com / Test123456');

    // List all users
    const users = await User.find({}).select('-password');
    console.log('\n📊 All users in database:');
    users.forEach(u => {
      console.log(`   - ${u.email} (${u.role}) - Active: ${u.isActive}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Setup complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestUsers();