import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function setupAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ username: 'andarg' });
    
    if (adminExists) {
      console.log('✅ Admin user already exists');
      console.log('\n📝 Admin Credentials:');
      console.log('   Username: andarg');
      console.log('   Password: kira@123');
    } else {
      // Create default admin user
      const admin = new User({
        username: 'andarg',
        passwordHash: 'kira@123',
        email: 'admin@injera.local',
        role: 'admin',
        isActive: true
      });

      await admin.save();
      console.log('✅ Admin user created successfully');
      console.log('\n📝 Admin Credentials:');
      console.log('   Username: andarg');
      console.log('   Password: kira@123');
    }

    await mongoose.connection.close();
    console.log('\n✅ Setup complete');
    process.exit(0);
  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  }
}

setupAdmin();
