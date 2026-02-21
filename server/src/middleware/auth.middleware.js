import { authService } from '../services/auth.service.js';

export const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw { status: 401, message: 'No token provided' };
    const token = header.split(' ')[1];
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) { next(err); }
};

export const optionalAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      req.user = authService.verifyToken(token);
    }
  } catch { /* ignore */ }
  next();
};