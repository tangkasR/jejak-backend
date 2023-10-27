import WisataModel from '../models/WisataModel.js';
import path from 'path';
import fs from 'fs';

export const getWisata = async (req, res) => {
  try {
    const response = await WisataModel.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getWisataById = async (req, res) => {
  try {
    const response = await WisataModel.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createWisata = async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'File gambar tolong dimasukan' });
  }
  const { nama, kategori, lokasi, deskripsi } = req.body;
  const file = req.files.file;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get('host')}/wisata_photo/${fileName}`;
  const allowedType = ['.png', '.jpeg', '.jpg'];
  if (!allowedType.includes(ext.toLowerCase())) {
    return res.status(422).json({ msg: 'Invalid image' });
  }

  file.mv(`./public/wisata_photo/${fileName}`, async err => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await WisataModel.create({
        nama: nama,
        kategori: kategori,
        lokasi: lokasi,
        deskripsi: deskripsi,
        image: fileName,
        url: url
      });
      res.status(201).json({ msg: 'Wisata berhasil ditambah' });
    } catch (error) {
      console.log(error.message);
    }
  });
};
export const updateWisata = async (req, res) => {
  const wisata = await WisataModel.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!wisata) return res.status(404).json({ msg: 'wisata tidak ditemukan' });

  let fileName = '';
  if (!req.files) {
    fileName = wisata.image;
  } else {
    const file = req.files.file;
    const ext = path.extname(file.name);
    const allowedType = ['.png', '.jpeg', '.jpg'];

    fileName = file.md5 + ext;

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: 'Invalid image' });
    }

    const filepath = `./public/wisata_photo/${wisata.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/wisata_photo/${fileName}`, err => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const { nama, kategori, lokasi, deskripsi } = req.body;
  const url = `${req.protocol}://${req.get('host')}/wisata_photo/${fileName}`;
  try {
    await WisataModel.update(
      {
        nama: nama,
        kategori: kategori,
        lokasi: lokasi,
        deskripsi: deskripsi,
        image: fileName,
        url: url
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    res.status(200).json({ msg: 'Wisata berhasil diubah' });
  } catch (error) {
    console.log(error.message);
  }
};
export const deleteWisata = async (req, res) => {
  try {
    const wisata = await WisataModel.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!wisata) return res.status(404).json({ msg: 'Wisata tidak ditemukan' });
    try {
      const filepath = `./public/wisata_photo/${wisata.image}`;
      fs.unlinkSync(filepath);
      await WisataModel.destroy({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({ msg: 'wisata berhasil dihapus' });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
  }
};
