import AdminModel from "../models/AdminModel.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

export const getAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const response = await AdminModel.findOne({
      where: {
        token: refreshToken
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createAdmin = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.jenis_kelamin ||
    !req.body.email ||
    !req.body.password ||
    !req.body.confirmPassword
  ) {
    return res.status(400).json({ msg: "Tolong masukan semua inputan" });
  }
  if (!req.files) {
    return res.status(400).json({ msg: "Tolong masukan foto" });
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res
      .status(400)
      .json({ msg: "Password dan konfirmasi password tidak sesuai" });
  }
  const nickname = req.body.name;
  const jenis_kelamin = req.body.jenis_kelamin;
  const role = "admin";
  const email = req.body.email;
  const password = req.body.password;
  const file = req.files.file;

  const ext = path.extname(file.name);
  const fileName = Math.random() + ext;
  const url = `https://jejak-backend-ef3c7rsig-tangkas-risdiantos-projects.vercel.app/admin_photo/${fileName}`;

  const hashPassword = await argon2.hash(password);
  const imgName = file.md5;
  file.mv(`./public/admin_photo/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: "error woi" });
    try {
      await AdminModel.create({
        name: nickname,
        jenis_kelamin: jenis_kelamin,
        role: role,
        email: email,
        password: hashPassword,
        image: fileName,
        url: url,
        img_name: imgName
      });
      res.status(201).json({ msg: "Behasil registrasi" });
    } catch (error) {
      console.log(error.message);
    }
  });
};
export const updateAdmin = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.jenis_kelamin ||
    !req.body.email ||
    !req.body.password ||
    !req.body.confirmPassword
  ) {
    return res.status(400).json({ msg: "Masukan semua inputan" });
  }
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const admin = await AdminModel.findOne({
    where: {
      token: refreshToken
    }
  });
  if (!admin) return res.status(404).json({ msg: "Admin tidak ditemukan" });

  let fileName = "";
  let imgName = "";
  let isImageExist = false;
  const files = fs.readdirSync("./public/admin_photo/");
  files.forEach((file) => {
    if (file === admin.image) {
      isImageExist = true;
    }
  });
  if (!req.files) {
    fileName = admin.image;
    imgName = admin.img_name;
  } else {
    const file = req.files.file;
    imgName = file.md5;
    fileName = admin.image;

    if (isImageExist === false) {
      const ext = path.extname(file.name);
      const allowedType = [".png", ".jpeg", ".jpg"];
      fileName = Math.random() + ext;

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid image" });
      }
      const filepath = `./public/admin_photo/${admin.image}`;
      file.mv(`./public/admin_photo/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
    if (imgName !== admin.img_name && isImageExist === true) {
      const ext = path.extname(file.name);
      const allowedType = [".png", ".jpeg", ".jpg"];
      fileName = Math.random() + ext;

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid image" });
      }
      const filepath = `./public/admin_photo/${admin.image}`;
      fs.unlinkSync(filepath);

      file.mv(`./public/admin_photo/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
  }

  const url = `${req.protocol}://${req.get("host")}/admin_photo/${fileName}`;
  const nickname = req.body.name;
  const jenis_kelamin = req.body.jenis_kelamin;
  const role = "admin";
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confirmPassword) {
    res
      .status(400)
      .json({ msg: "Password dan konfirmasi password tidak sesuai" });
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
        url: url,
        img_name: imgName
      },
      {
        where: {
          id: admin.id
        }
      }
    );
    res.status(200).json({ msg: "admin berhasil Update" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
export const deleteAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const admin = await AdminModel.findOne({
      where: {
        token: refreshToken
      }
    });
    const adminId = admin.id;
    if (!admin) return res.status(404).json({ msg: "admin tidak ditemukan" });
    let isImageExist = false;
    const files = fs.readdirSync("./public/admin_photo/");
    files.forEach((file) => {
      if (file === admin.image) {
        isImageExist = true;
      }
    });
    try {
      const filepath = `./public/admin_photo/${admin.image}`;

      if (isImageExist === true) {
        fs.unlinkSync(filepath);
      }
      await AdminModel.destroy({
        where: {
          id: adminId
        }
      });
      res.clearCookie("refreshToken");
      res.status(200).json({ msg: "Berhasil menghapus akun" });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const Login = async (req, res) => {
  if (!req.body.email || !req.body.email) {
    return res.status(400).json({ msg: "Masukan semua input" });
  }
  const admin = await AdminModel.findOne({
    where: {
      email: req.body.email
    }
  });
  if (!admin) {
    return res.status(404).json({ msg: "Email atau password salah" });
  }
  const match = await argon2.verify(admin.password, req.body.password);
  if (!match) {
    return res.status(404).json({ msg: "Email atau password salah" });
  }
  const adminId = admin.id;
  const refreshToken = jwt.sign(
    { adminId },
    "dasdf213rwq079123478khh12kehkwe89789ysudkh12987ydhkhasdty638tasd",
    {
      expiresIn: "1d"
    }
  );
  await AdminModel.update(
    {
      token: refreshToken
    },
    {
      where: {
        id: adminId
      }
    }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: false,
    maxAge: 60 * 60 * 1000,
    secure: true
  });
  res.status(200).json(admin);
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const admin = await AdminModel.findOne({
    where: {
      token: refreshToken
    }
  });

  if (!admin) return res.sendStatus(204);

  const adminId = admin.id;
  await AdminModel.update(
    {
      token: null
    },
    {
      where: {
        id: adminId
      }
    }
  );
  res.clearCookie("refreshToken");
  res.status(200).json(admin);
};
