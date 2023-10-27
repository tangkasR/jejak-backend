import express from 'express';
import {
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  Login
} from '../controllers/AdminController.js';

const router = express.Router();

router.get('/getadmin/:id', getAdminById);
router.post('/registrasi', createAdmin);
router.put('/editadmin/:id', updateAdmin);
router.delete('/deleteadmin/:id', deleteAdmin);
router.post('/login', Login);
export default router;
