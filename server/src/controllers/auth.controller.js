import { authService } from '../services/auth.service.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const result = await authService.register({ username, email, password });
      res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  },
};