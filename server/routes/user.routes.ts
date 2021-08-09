import { Router } from 'express';
import {
  authUser,
  deleteUser,
  getUserById,
  getUserDetails,
  getUsers,
  registerAdmin,
  registerDeputy,
  registerUser,
  updateUserDetails,
} from '../controllers/user.controller';
import { admin, adminOrDeputy, protect } from '../middleware/auth.middleware';

const router = Router();

router.route('/').get(protect, adminOrDeputy, getUsers).post(registerUser);
router.post('/login', authUser);
router.post('/deputy', protect, admin, registerDeputy);
router.post('/admin', protect, admin, registerAdmin);
router
  .route('/profile')
  .get(protect, getUserDetails)
  .put(protect, updateUserDetails);
router
  .route('/:id')
  .get(protect, adminOrDeputy, getUserById)
  .delete(protect, admin, deleteUser);

export default router;
