const db = require("../models");
// const config = require("../config.db");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = db.user;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

verifyToken = (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
  
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }
    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "superadmin") {
        return next();
      }
    }
    return res.status(403).send({
      message: "Require Super Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Super Admin role!",
    });
  }
};

isSuperAdminOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "superadmin") {
        return next();
      }
      if (roles[i].name === "admin") {
        return next();
      }
    }
    return res.status(403).send({
      message: "Require Super Admin or Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Super Admin or Admin role!",
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isSuperAdmin,
  isSuperAdminOrAdmin,
  upload
};
module.exports = authJwt;
