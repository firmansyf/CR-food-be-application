const config = require('../db.config')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    // operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
    },
});
  
const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);

db.product = require("./product.model")(sequelize, Sequelize);
db.category = require("./category.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId",
  });
  
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId",
});

db.category.belongsToMany(db.product, {
    through: "product_category",
    foreignKey: "categoryId",
    otherKey: "productId",
});
  
db.product.belongsToMany(db.category, {
    through: "product_category",
    foreignKey: "categoryId",
    otherKey: "productId",
});

db.ROLES = ["user", "admin", "superadmin"];
module.exports = db;