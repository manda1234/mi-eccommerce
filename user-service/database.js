const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "userdb",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "root",
  {
    host: process.env.DB_HOST || "user-db",
    dialect: "mysql",
    port: 3306,
    logging: false, 
  }
);

module.exports = sequelize;
