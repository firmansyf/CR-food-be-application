const db = require("../models");
const User = db.user;
const Role = db.role;

exports.user = async (req, res) => {
    try {
      const users = await User.findAll({
        include: {
          model: Role,
          attributes: ["name"],
          through: { attributes: [] }, // Hapus atribut tambahan dari tabel relasi
        },
      });
      res.status(200).json(users);
    } catch (err) {
      console.error("Error in userBoard controller:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  exports.admin = async (req, res) => {
    try {
        const users = await User.findAll({
          include: {
            model: Role,
            attributes: ["name"],
            through: { attributes: [] }, // Hapus atribut tambahan dari tabel relasi
          },
        });
        res.status(200).json(users);
      } catch (err) {
        console.error("Error in userBoard controller:", err);
        res.status(500).json({ message: "Internal server error" });
      }
  };
  
  exports.superadmin = async (req, res) => {
    try {
        const users = await User.findAll({
          include: {
            model: Role,
            attributes: ["name"],
            through: { attributes: [] }, // Hapus atribut tambahan dari tabel relasi
          },
        });
        res.status(200).json(users);
      } catch (err) {
        console.error("Error in userBoard controller:", err);
        res.status(500).json({ message: "Internal server error" });
      }
  };