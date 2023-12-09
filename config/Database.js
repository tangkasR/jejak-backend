import { Sequelize } from "sequelize";

const db = new Sequelize(
  "b8zdcb3owgysp6kesmmt",
  "uvxqqszklwcnersc",
  "uvxqqszklwcnersc",
  {
    host: "b8zdcb3owgysp6kesmmt-mysql.services.clever-cloud.com",
    dialect: "mysql",
    port: "3306"
  }
);

export default db;
