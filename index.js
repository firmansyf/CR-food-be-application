const express = require('express')
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const cookieParser = require('cookie-parser');

// const db = require('./models')
// const Roles = db.role;

const app = express()
app.use(cookieParser());
app.use(bodyParser.json())

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileStorage = multer.diskStorage({
  destination: (res, req, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
    cors({
      origin: "http://localhost:3000", // Ganti dengan origin frontend kamu
      credentials: true, // Allow credentials (cookies) to be sent
    })
);

// function roleInitial() {
//   Roles.create({
//     id: 1,
//     name: "user",
//   });

//   Roles.create({
//     id: 2,
//     name: "admin",
//   });

//   Roles.create({
//     id: 3,
//     name: "superadmin",
//   });
//}

// db.sequelize.sync({ alter: true }).then(() => {
//   console.log("Database synchronized");
//   roleInitial();
// });

require('dotenv').config();
  
// Routes Api
require('./routes/auth.route')(app)
require('./routes/product.route')(app)
require('./routes/user.route')(app)

// Running Port
app.listen(8000, () => console.log("Server Running on Port:8000"))

