import HotelModel from "../models/HotelModel.js";
import WisataModel from "../models/WisataModel.js";
import cloudinary from "../utils/Cloudinary.js";

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
  if (
    !req.body.nama ||
    !req.body.lokasi ||
    !req.body.deskripsi ||
    !req.body.wisatumId ||
    !req.body.file
  ) {
    return res.status(400).json({ msg: "Masukan semua inputan" });
  }

  const { nama, lokasi, deskripsi, wisatumId, file } = req.body;
  const result = await cloudinary.uploader.upload(file, {
    folder: "hotel"
  });
  if (result.length !== 0) {
    try {
      await HotelModel.create({
        nama: nama,
        lokasi: lokasi,
        deskripsi: deskripsi,
        url: result.url,
        img_id: result.public_id,
        wisatumId: wisatumId
      });
      res.status(201).json({ msg: "Hotel berhasil ditambah" });
    } catch (error) {
      console.log(error.message);
    }
  }
};
export const updateHotel = async (req, res) => {
  const hotel = await HotelModel.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!hotel) return res.status(404).json({ msg: "Hotel tidak ditemukan" });
  if (
    !req.body.nama ||
    !req.body.lokasi ||
    !req.body.deskripsi ||
    !req.body.wisatumId ||
    !req.body.file
  ) {
    return res.status(400).json({ msg: "Masukan semua inputan" });
  }
  const imgId = hotel.img_id;
  await cloudinary.uploader.destroy(imgId);

  const { nama, lokasi, deskripsi, wisatumId, file } = req.body;
  const result = await cloudinary.uploader.upload(file, {
    folder: "hotel"
  });
  if (result.length !== 0) {
    try {
      await HotelModel.update(
        {
          nama: nama,
          lokasi: lokasi,
          deskripsi: deskripsi,
          url: result.url,
          img_id: result.public_id,
          wisatumId: wisatumId
        },
        {
          where: {
            id: hotel.id
          }
        }
      );
      res.status(200).json({ msg: "Hotel berhasil diubah" });
    } catch (error) {
      console.log(error.message);
    }
  }
};
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await HotelModel.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!hotel) return res.status(404).json({ msg: "Hotel tidak ditemukan" });
    const imgId = hotel.img_id;
    await cloudinary.uploader.destroy(imgId);

    await HotelModel.destroy({
      where: {
        id: hotel.id
      }
    });
    res.status(200).json({ msg: "Hotel berhasil dihapus" });
  } catch (error) {
    console.log(error.message);
  }
};
