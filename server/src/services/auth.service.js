import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

export const authService = {
  async register({ username, email, password }) {
    const [existingEmail, existingUsername] = await Promise.all([
      userRepository.findByEmail(email),
      userRepository.findByUsername(username),
    ]);
    if (existingEmail) throw { status: 409, message: 'Email already in use' };
    if (existingUsername) throw { status: 409, message: 'Username already taken' };

    const user = await userRepository.create({ username, email, password });
    const token = signToken(user._id);
    return { user, token };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw { status: 401, message: 'Invalid email or password' };

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw { status: 401, message: 'Invalid email or password' };

    const token = signToken(user._id);
    return { user, token };
  },

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw { status: 401, message: 'Invalid or expired token' };
    }
  },
};