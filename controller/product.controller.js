const db = require('../models')
const Product = db.product;
const Category = db.category;

exports.allAccess = async (req, res) => {
    try {
      const users = await Product.findAll({
        include: {
          model: Category,
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
  
exports.productById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({
      where: { id },
      include: {
        model: Category,
        attributes: ['name'],
        through: { attributes: [] },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error('Error in productById controller:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};