import WisataModel from "../models/WisataModel.js";
import ReviewModel from "../models/ReviewModel.js";
import HotelModel from "../models/HotelModel.js";
import ReviewHotelModel from "../models/ReviewHotelModel.js";
import GalleryModel from "../models/GalleryModel.js";
import cloudinary from "../utils/Cloudinary.js";

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
  if (
    !req.body.nama ||
    !req.body.kategori ||
    !req.body.lokasi ||
    !req.body.deskripsi ||
    !req.body.latitude ||
    !req.body.longitude ||
    !req.body.file
  ) {
    return res.status(400).json({ msg: "Masukan semua inputan" });
  }

  const { nama, kategori, lokasi, deskripsi, latitude, longitude, file } =
    req.body;

  const result = await cloudinary.uploader.upload(file, {
    folder: "wisata"
  });
  if (result.length !== 0) {
    try {
      await WisataModel.create({
        nama: nama,
        kategori: kategori,
        lokasi: lokasi,
        deskripsi: deskripsi,
        url: result.url,
        img_id: result.public_id,
        latitude: latitude,
        longitude: longitude
      });
      res.status(201).json({ msg: "Wisata berhasil ditambah" });
    } catch (error) {
      console.log(error.message);
    }
  }
};
export const updateWisata = async (req, res) => {
  if (
    !req.body.nama ||
    !req.body.kategori ||
    !req.body.lokasi ||
    !req.body.deskripsi ||
    !req.body.latitude ||
    !req.body.longitude ||
    !req.body.file
  ) {
    return res.status(400).json({ msg: "Masukan semua inputan" });
  }
  const wisata = await WisataModel.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!wisata) return res.status(404).json({ msg: "wisata tidak ditemukan" });

  const { nama, kategori, lokasi, deskripsi, latitude, longitude, file } =
    req.body;

  try {
    const imgId = wisata.img_id;
    await cloudinary.uploader.destroy(imgId);

    const result = await cloudinary.uploader.upload(file, {
      folder: "wisata"
    });
    await WisataModel.update(
      {
        nama: nama,
        kategori: kategori,
        lokasi: lokasi,
        deskripsi: deskripsi,
        url: result.url,
        img_id: result.public_id,
        latitude: latitude,
        longitude: longitude
      },
      {
        where: {
          id: wisata.id
        }
      }
    );
    res.status(200).json({ msg: "Wisata berhasil diubah" });
  } catch (error) {
    console.log(error);
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
          const imgId = hotel.img_id;
          await cloudinary.uploader.destroy(imgId);

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
          const imgId = data.img_id;
          await cloudinary.uploader.destroy(imgId);

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
      const imgId = wisata.img_id;
      await cloudinary.uploader.destroy(imgId);

      await WisataModel.destroy({
        where: {
          id: wisata.id
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
