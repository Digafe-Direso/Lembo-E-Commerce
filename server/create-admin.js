import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String
});
const User = mongoose.model('User', userSchema);

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const adminExists = await User.findOne({ email: 'admin@example.com' });
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Admin user created: admin@example.com / admin123');
  } else {
    console.log('✅ Admin user already exists');
  }
  
  process.exit();
}
createAdmin();
