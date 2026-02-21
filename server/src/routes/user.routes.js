import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { userRepository } from '../repositories/user.repository.js';

const router = Router();

router.get('/:username', async (req, res) => {
  const user = await userRepository.findByUsername(req.params.username);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});

router.put('/profile', protect, async (req, res) => {
  const { bio, avatar } = req.body;
  const user = await userRepository.updateById(req.user.id, { bio, avatar });
  res.json({ success: true, data: user });
});

export default router;