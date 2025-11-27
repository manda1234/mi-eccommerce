const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define(
  "User",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "users", // HARUS kecil, sesuai database
    timestamps: true,
  }
);

module.exports = User;
