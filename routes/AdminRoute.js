import express from 'express';
import {
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from '../controllers/AdminController.js';

const router = express.Router();

router.get('/getadmin/:id', getAdminById);
router.post('/registrasi', createAdmin);
router.put('/editadmin/:id', updateAdmin);
router.delete('/deleteadmin/:id', deleteAdmin);
export default router;
