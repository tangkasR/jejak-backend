import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import WisataModel from './WisataModel.js';
const { DataTypes } = Sequelize;

const HotelModel = db.define(
  'hotel',
  {
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    img_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total_rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_viewers: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    freezeTableName: true
  }
);

WisataModel.hasMany(HotelModel);
HotelModel.belongsTo(WisataModel);

export default HotelModel;
