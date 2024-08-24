const db = require("../models");
const User = db.user;
const Role = db.role;

exports.me = async (req, res) => {
  try {
    // Mengambil ID user dari request (misalnya melalui token atau session)
    const userId = req.userId;
    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: Role,
        attributes: ["name"],
        through: { attributes: [] }, // Hapus atribut tambahan dari tabel relasi
      },
      attributes: { exclude: ["password"] }, // Jangan sertakan password dalam respon
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in me controller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const userId = req.userId;
    // Data yang akan diupdate, diambil dari body request
    const { username, gender, no_telepone, alamat, email, password, roleId } = req.body;
    let imagePath;

    if (req.file) {
      imagePath = req.file.path; // Menyimpan path gambar yang diunggah
    }

    // Mengambil user berdasarkan ID
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update data user, jika field tidak diisi maka tidak diubah
    user.username = username || user.username;
    user.gender = gender || user.gender;
    user.no_telepone = no_telepone || user.no_telepone;
    user.alamat = alamat || user.alamat;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Enkripsi password jika diubah
    }
    if (roleId) {
      const role = await Role.findOne({ where: { id: roleId } });
      if (!role) {
        return res.status(400).json({ message: "Invalid role ID" });
      }
      await user.setRoles([role]); // Mengubah peran user
    }

    if (imagePath) {
      user.image = imagePath; // Menyimpan path gambar di database
    }
    
    await user.save(); // Menyimpan perubahan ke database

    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error in updateUser controller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


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