import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const db = new Sequelize(
  "b8zdcb3owgysp6kesmmt",
  "uvxqqszklwcnersc",
  "pjp5xQF67wJyqs9lNULu",
  {
    host: "b8zdcb3owgysp6kesmmt-mysql.services.clever-cloud.com",
    dialect: "mysql",
    port: "3306",
    dialectModule: mysql2
  }
);

export default db;
