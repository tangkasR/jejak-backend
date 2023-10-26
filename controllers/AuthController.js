import AdminModel from '../models/AdminModel.js';
import argon2 from 'argon2';

export const Login = async (req, res) => {
  const admin = await AdminModel.findOne({
    where: {
      email: req.body.email
    }
  });
  if (!admin) return res.status(404).json({ msg: 'Admin tidak ditemukan' });
  const match = await argon2.verify(admin.password, req.body.password);
  if (!match) return res.status(400).json({ msg: 'Email atau password salah' });
  res.status(200).json(admin);
};
