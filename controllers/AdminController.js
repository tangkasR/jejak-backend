import AdminModel from '../models/AdminModel.js';
import argon2 from 'argon2';
import path from 'path';
import fs from 'fs';

export const getAdminById = async (req, res) => {
  try {
    const response = await AdminModel.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createAdmin = async (req, res) => {
  if (req.file === null) {
    return res.status(400).json({ msg: 'no such file' });
  }
  const nickname = req.body.name;
  const jenis_kelamin = req.body.jenis_kelamin;
  const role = 'admin';
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const file = req.files.file;

  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;

  const url = `${req.protocol}://${req.get('host')}/admin_photo/${fileName}`;
  const allowedType = ['.png', '.jpeg', '.jpg'];
  if (!allowedType.includes(ext.toLowerCase())) {
    return res.status(422).json({ msg: 'Invalid image' });
  }
  if (password !== confirmPassword) {
    res
      .status(400)
      .json({ msg: 'Password dan konfirmasi password tidak sesuai' });
  }
  const hashPassword = await argon2.hash(password);

  file.mv(`./public/admin_photo/${fileName}`, async err => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await AdminModel.create({
        name: nickname,
        jenis_kelamin: jenis_kelamin,
        role: role,
        email: email,
        password: hashPassword,
        image: fileName,
        url: url
      });
      res.status(201).json({ msg: 'Behasil registrasi' });
    } catch (error) {
      console.log(error.message);
    }
  });
};
export const updateAdmin = async (req, res) => {
  const admin = await AdminModel.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!admin) return res.status(404).json({ msg: 'Admin tidak ditemukan' });

  let fileName = '';

  if (!req.files) {
    fileName = admin.image;
  } else {
    const file = req.files.file;
    const ext = path.extname(file.name);
    const allowedType = ['.png', '.jpeg', '.jpg'];

    fileName = file.md5 + ext;

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: 'Invalid image' });
    }

    const filepath = `./public/admin_photo/${admin.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/admin_photo/${fileName}`, err => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const url = `${req.protocol}://${req.get('host')}/admin_photo/${fileName}`;
  const nickname = req.body.name;
  const jenis_kelamin = req.body.jenis_kelamin;
  const role = 'admin';
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  console.log(nickname);
  console.log(jenis_kelamin);
  console.log(role);
  console.log(email);
  console.log(password);
  console.log(confirmPassword);
  let hashPassword;
  if (password === '' || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confirmPassword) {
    res
      .status(400)
      .json({ msg: 'Password dan konfirmasi password tidak sesuai' });
  }
  try {
    await AdminModel.update(
      {
        name: nickname,
        jenis_kelamin: jenis_kelamin,
        role: role,
        email: email,
        password: hashPassword,
        image: fileName,
        url: url
      },
      {
        where: {
          id: admin.id
        }
      }
    );
    res.status(200).json({ msg: 'admin berhasil Update' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await AdminModel.findOne({
      where: {
        id: req.params.id
      }
    });
    console.log(admin);
    if (!admin) return res.status(404).json({ msg: 'admin tidak ditemukan' });
    try {
      const filepath = `./public/admin_photo/${admin.image}`;
      fs.unlinkSync(filepath);
      await AdminModel.destroy({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({ msg: 'Berhasil menghapus akun' });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

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
