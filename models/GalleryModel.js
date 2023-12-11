import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import WisataModel from "./WisataModel.js";
const { DataTypes } = Sequelize;

const GalleryModel = db.define(
  "gallery",
  {
    img_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    img_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    public_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true
  }
);

WisataModel.hasMany(GalleryModel);
GalleryModel.belongsTo(WisataModel);

export default GalleryModel;
