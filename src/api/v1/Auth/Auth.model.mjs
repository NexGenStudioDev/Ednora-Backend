import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import envConstant from '../../../constant/env.constant.mjs';

const AuthenticationSchema = new Schema(
  {
    provider_Name: {
      type: String,
    },

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },

    picture: {
      type: String,
      default: '/api/images/Student_Avtar.webp',
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      required: true,
      enum: ['student', 'teacher', 'admin', 'super_admin'],
      default: 'student',
    },
  },
  { timestamps: true }
);

AuthenticationSchema.methods.Genrate_Password = function () {
  const password = Math.random().toString(36).slice(-8);
  return password;
};

AuthenticationSchema.methods.hashPassword = async function (password) {
  const hash = await bcrypt.hash(password, 15);
  return hash;
};

AuthenticationSchema.methods.hashEmail = async function (email) {
  try {
    if (email) {
      const secret = envConstant.JWT_SECRET || process.env.JWT_SECRET;
      const JwtEmail = jwt.sign(
        { email: email, role: this.role || 'admin' },
        secret,
        {
          expiresIn: envConstant.JWT_EXPIRES_IN || '7d',
        }
      );

      if (JwtEmail) {
        return JwtEmail;
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

AuthenticationSchema.methods.comparePassword = async function (password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    if (!match) {
      throw new Error('Failed to Match Password');
    }
    return match;
  } catch (error) {
    throw new Error(`Password comparison error: ${error.message}`);
  }
};

AuthenticationSchema.statics.checkRole = async function (email) {
  const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
  const cleanEmail = (email || '').toLowerCase().trim();

  if (cleanEmail === defaultEmail) {
    return 'super admin';
  }

  try {
    const user = await this.findOne({ email: cleanEmail });
    if (!user) {
      throw new Error('User not found');
    }
    return user.role;
  } catch (error) {
    if (cleanEmail === defaultEmail) {
      return 'super admin';
    }
    throw new Error(`Error checking user role: ${error.message}`);
  }
};

const Authentication = model('Authentication', AuthenticationSchema);

export default Authentication;
