import WisataModel from "../models/WisataModel.js";
import ReviewModel from "../models/ReviewModel.js";
import HotelModel from "../models/HotelModel.js";
import ReviewHotelModel from "../models/ReviewHotelModel.js";
import GalleryModel from "../models/GalleryModel.js";
import path from "path";
import fs from "fs";

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
  const dataWisata = await WisataModel.findAll();
  if (
    !req.body.nama ||
    !req.body.kategori ||
    !req.body.lokasi ||
    !req.body.deskripsi ||
    !req.body.latitude ||
    !req.body.longitude
  ) {
    return res.status(400).json({ msg: "Masukan semua inputan" });
  }
  if (!req.files) {
    return res.status(400).json({ msg: "File gambar tolong dimasukan" });
  }

  const { nama, kategori, lokasi, deskripsi, latitude, longitude } = req.body;
  const file = req.files.file;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/wisata_photo/${fileName}`;
  const allowedType = [".png", ".jpeg", ".jpg"];
  if (!allowedType.includes(ext.toLowerCase())) {
    return res.status(422).json({ msg: "Invalid image" });
  }
  let isFilenameSame = false;
  dataWisata.forEach((data) => {
    if (data.image === fileName) {
      isFilenameSame = true;
    }
  });
  if (isFilenameSame === true) {
    return res
      .status(400)
      .json({ msg: "Foto yang dimasukan sudah digunakan! Tolong ganti" });
  }

  file.mv(`./public/wisata_photo/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await WisataModel.create({
        nama: nama,
        kategori: kategori,
        lokasi: lokasi,
        deskripsi: deskripsi,
        image: fileName,
        url: url,
        latitude: latitude,
        longitude: longitude
      });
      res.status(201).json({ msg: "Wisata berhasil ditambah" });
    } catch (error) {
      console.log(error.message);
    }
  });
};
export const updateWisata = async (req, res) => {
  const dataWisata = await WisataModel.findAll();
  if (
    !req.body.nama ||
    !req.body.kategori ||
    !req.body.lokasi ||
    !req.body.deskripsi ||
    !req.body.latitude ||
    !req.body.longitude
  ) {
    return res.status(400).json({ msg: "Masukan semua inputan" });
  }
  const wisata = await WisataModel.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!wisata) return res.status(404).json({ msg: "wisata tidak ditemukan" });

  let fileName = "";
  let isFilenameSame = false;
  if (!req.files) {
    fileName = wisata.image;
  } else {
    const file = req.files.file;
    const ext = path.extname(file.name);
    const allowedType = [".png", ".jpeg", ".jpg"];

    fileName = file.md5 + ext;
    dataWisata.forEach((data) => {
      if (data.image === fileName) {
        isFilenameSame = true;
      }
    });
    if (isFilenameSame === true) {
      return res.status(400).json({
        msg: "Foto yang dimasukan sudah digunakan! Tolong ganti atau kosongkan inputan foto"
      });
    }
    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: "Invalid image" });
    }

    const filepath = `./public/wisata_photo/${wisata.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/wisata_photo/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const { nama, kategori, lokasi, deskripsi, latitude, longitude } = req.body;
  const url = `${req.protocol}://${req.get("host")}/wisata_photo/${fileName}`;
  try {
    await WisataModel.update(
      {
        nama: nama,
        kategori: kategori,
        lokasi: lokasi,
        deskripsi: deskripsi,
        image: fileName,
        url: url,
        latitude: latitude,
        longitude: longitude
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    res.status(200).json({ msg: "Wisata berhasil diubah" });
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
    if (!wisata) return res.status(404).json({ msg: "Wisata tidak ditemukan" });

    // delete hotel dan review hotel yang berelasi
    const hotels = await HotelModel.findAll();
    const reviewsHotel = await ReviewHotelModel.findAll();
    if (hotels) {
      hotels.forEach(async (hotel) => {
        if (hotel.wisatumId === wisata.id) {
          const filepath = `./public/hotel_photo/${hotel.image}`;
          fs.unlinkSync(filepath);
          await HotelModel.destroy({
            where: {
              id: hotel.id
            }
          });
          reviewsHotel.forEach(async (review) => {
            if (review.hotelId === hotel.id) {
              await ReviewHotelModel.destroy({
                where: {
                  id: review.id
                }
              });
            }
          });
        }
      });
    }
    // end delete hotel yang berelasi
    // delete review yang berelasi
    const reviews = await ReviewModel.findAll();
    if (reviews) {
      reviews.forEach(async (review) => {
        if (review.wisatumId === wisata.id) {
          await ReviewModel.destroy({
            where: {
              id: review.id
            }
          });
        }
      });
    }
    // end delete review yang berelasi

    // delete gallery yang berelasi
    const gallery = await GalleryModel.findAll();
    if (gallery) {
      gallery.forEach(async (data) => {
        if (data.wisatumId === wisata.id) {
          const filepath = `./public/gallery_photo/${data.image[0]}`;
          fs.unlinkSync(filepath);
          await GalleryModel.destroy({
            where: {
              id: data.id
            }
          });
        }
      });
    }
    // end delete gallery yang berelasi
    try {
      const filepath = `./public/wisata_photo/${wisata.image}`;
      fs.unlinkSync(filepath);
      await WisataModel.destroy({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({ msg: "wisata berhasil dihapus" });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
  }
};
