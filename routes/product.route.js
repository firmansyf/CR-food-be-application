const controller = require('../controller/product.controller')

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
  
    // API Public 
    app.get("/api/v1/product", controller.allAccess);
    app.get("/api/v1/product/:id", controller.productById);
  
  };