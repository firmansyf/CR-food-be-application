const { authJwt } = require("../middleware");
const controller = require("../controller/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.get("/api/v1/auth/user", [authJwt.verifyToken], controller.user);
  app.get(
    "/api/v1/auth/superadmin",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.superadmin
  );
  app.get(
    "/api/v1/auth/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.admin
  );
};
