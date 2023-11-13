import GalleryModel from "../models/GalleryModel.js";
import WisataModel from "../models/WisataModel.js";
import path from "path";
import fs from "fs";

export const getGalleryByWisataId = async (req, res) => {
  try {
    const response = await GalleryModel.findAll(
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
export const getGalleryById = async (req, res) => {
  try {
    const response = await GalleryModel.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createGallery = async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ msg: "File gambar tolong dimasukan" });
  }
  const id = req.params.id;
  const file = req.files.file;
  const ext = path.extname(file.name);
  const fileName = Math.random() + ext;
  const url = `${req.protocol}://${req.get("host")}/gallery_photo/${fileName}`;
  const allowedType = [".png", ".jpeg", ".jpg"];
  if (!allowedType.includes(ext.toLowerCase())) {
    return res.status(422).json({ msg: "Invalid image" });
  }
  const imgName = file.md5;
  file.mv(`./public/gallery_photo/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await GalleryModel.create({
        image: fileName,
        url: url,
        img_name: imgName,
        wisatumId: id
      });
      res.status(201).json({ msg: "Foto berhasil ditambah" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const deleteGallery = async (req, res) => {
  try {
    const foto = await GalleryModel.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!foto) return res.status(404).json({ msg: "Foto tidak ditemukan" });
    try {
      const filepath = `./public/gallery_photo/${foto.image}`;
      fs.unlinkSync(filepath);
      await GalleryModel.destroy({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({ msg: "Foto berhasil dihapus" });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
  }
};
