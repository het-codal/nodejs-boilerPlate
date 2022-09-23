"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        first_name: "Het",
        last_name: "Rachh",
        email: "hrachh@codal.com",
        password: bcrypt.hashSync("admin123", 10),
        date_of_birth: "1997-04-17",
        role: 0,
      },
      {
        first_name: "Het",
        last_name: "Thakkar",
        email: "codal@codaldemo.com",
        date_of_birth: "1997-04-17",
        password: bcrypt.hashSync("user123", 10),
        role: 1,
      },
    ];
    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
