const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');;
const db = require("../models");
const Op = db.Sequelize.Op;

const User = db.user;
const Role = db.role;

// funtion untuk register
exports.signup = async (req, res) => {
    try {
      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        gender: req.body.gender,
        no_telepone: req.body.no_telepone,
        alamat: req.body.alamat,
        image: req.body.image,
        password: bcrypt.hashSync(req.body.password, 8),
      });
  
      if (req.body.roles) {
        const roles = await Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        });
        const result = user.setRoles(roles);
        if (result) res.send({ message: "User registered successfully!" });
      } else {
        // user has role = 1
        const result = user.setRoles([1]);
        if (result) res.send({ message: "User registered successfully!" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
};


// Function untuk login
exports.signin = async (req, res) => {
    try {
      // Cari pengguna berdasarkan username
      const user = await User.findOne({
        where: {
          username: req.body.username,
        },
      });
  
      // Jika pengguna tidak ditemukan
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      // Verifikasi password
      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid password!" });
      }
  
      // Buat token JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 86400, // 24 jam
      });
  
      // Dapatkan peran pengguna (roles)
      let authorities = [];
      const roles = await user.getRoles(); // Asumsi Anda memiliki metode untuk mendapatkan peran pengguna
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
  
      // Simpan token dalam cookies
      res.cookie('token', token, {
        httpOnly: true, // Mengatur agar cookie hanya dapat diakses oleh HTTP (tidak dapat diakses oleh JavaScript di klien)
        // secure: process.env.NODE_ENV === 'production', // Gunakan cookie secure hanya di produksi
        secure: true,
        maxAge: 86400000, // 24 jam dalam milidetik
        // sameSite: 'strict', // Mengatur agar cookie hanya dikirim dengan permintaan pertama ke domain yang sama
      });
  
      // Respon berhasil
      return res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        no_telepone: user.no_telepone,
        alamat: user.alamat,
        image: user.image,
        roles: authorities,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

exports.signout = async (req, res) => {
    try {
      req.session = null;

      res.clearCookie('token', {
        httpOnly: true,
        secure: true, // Atur menjadi true jika menggunakan HTTPS
        // sameSite: 'strict'
      });

      return res.status(200).send({
        message: "You've been signed out!",
      });
    } catch (err) {
      this.next(err);
    }
  };

// Function untuk cek login
exports.auth = async (req, res) => {
  try {
    // Mendapatkan token dari cookies
    const token = req.cookies.token;
    // Memeriksa apakah token ada
    if (!token) {
      return res.status(401).json({ message: 'User not logged in', loggin: false });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Jika token valid, kirim respons sukses
    return res.status(200).json({ message: 'User is logged in', user: decoded, loggin: true });
  } catch (err) {
    console.log('err :', err)
    // Jika token tidak valid atau kadaluarsa
    // if (err.name === 'TokenExpiredError') {
    //   return res.status(401).json({ message: 'Token expired' });
    // }

    // if (err.name === 'JsonWebTokenError') {
    //   return res.status(401).json({ message: 'Invalid token' });
    // }

    // Penanganan kesalahan umum lainnya
    return res.status(500).json({ message: 'Internal server error' });
  }
};
