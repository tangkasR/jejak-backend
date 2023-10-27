import HotelModel from '../models/HotelModel.js';
import WisataModel from '../models/WisataModel.js';
import path from 'path';
import fs from 'fs';

export const getAllHotel = async (req, res) => {
  try {
    const response = await HotelModel.findAll({
      include: [
        {
          model: WisataModel
        }
      ]
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getHotelByWisataId = async (req, res) => {
  try {
    const response = await HotelModel.findAll(
      {
        where: {
          wisatumId: req.params.id
        }
      },
      {
        include: [
          {
            model: WisataModel
          }
        ]
      }
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const response = await HotelModel.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createHotel = async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'File gambar tolong dimasukan' });
  }
  const { nama, lokasi, deskripsi, wisatumId } = req.body;
  const file = req.files.file;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get('host')}/hotel_photo/${fileName}`;
  const allowedType = ['.png', '.jpeg', '.jpg'];
  if (!allowedType.includes(ext.toLowerCase())) {
    return res.status(422).json({ msg: 'Invalid image' });
  }
  file.mv(`./public/hotel_photo/${fileName}`, async err => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await HotelModel.create({
        nama: nama,
        lokasi: lokasi,
        deskripsi: deskripsi,
        image: fileName,
        url: url,
        wisatumId: wisatumId
      });
      res.status(201).json({ msg: 'Hotel berhasil ditambah' });
    } catch (error) {
      console.log(error.message);
    }
  });
};
export const updateHotel = async (req, res) => {
  const hotel = await HotelModel.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!hotel) return res.status(404).json({ msg: 'Hotel tidak ditemukan' });
  let fileName = '';
  if (!req.files) {
    fileName = hotel.image;
  } else {
    const file = req.files.file;
    const ext = path.extname(file.name);
    const allowedType = ['.png', '.jpeg', '.jpg'];
    fileName = file.md5 + ext;
    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: 'Invalid image' });
    }
    const filepath = `./public/hotel_photo/${hotel.image}`;
    fs.unlinkSync(filepath);
    file.mv(`./public/hotel_photo/${fileName}`, err => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const { nama, lokasi, deskripsi, wisatumId } = req.body;
  const url = `${req.protocol}://${req.get('host')}/hotel_photo/${fileName}`;
  try {
    await HotelModel.update(
      {
        nama: nama,
        lokasi: lokasi,
        deskripsi: deskripsi,
        image: fileName,
        url: url,
        wisatumId: wisatumId
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    res.status(200).json({ msg: 'Hotel berhasil diubah' });
  } catch (error) {
    console.log(error.message);
  }
};
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await HotelModel.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!hotel) return res.status(404).json({ msg: 'Hotel tidak ditemukan' });
    try {
      const filepath = `./public/hotel_photo/${hotel.image}`;
      fs.unlinkSync(filepath);
      await HotelModel.destroy({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({ msg: 'Hotel berhasil dihapus' });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
  }
};
