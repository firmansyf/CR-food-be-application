module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
          type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
          },
        gender: {
          type: Sequelize.STRING,
        },
        no_telepone: {
          type: Sequelize.STRING,
        },
        alamat: {
          type: Sequelize.STRING,
        },
        image: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
        },
      });
    return User;
}