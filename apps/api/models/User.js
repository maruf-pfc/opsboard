import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        'ADMIN',
        'MANAGER',
        'TRAINER',
        'Developer',
        'Teaching Assistant',
        'MEMBER',
      ],
      default: 'MEMBER',
    },
    phone: { type: String },
    facebookUrl: { type: String },
    profileImage: { type: String },
  },
  { timestamps: true },
);

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', UserSchema);
export default User;
