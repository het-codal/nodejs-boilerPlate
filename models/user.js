"use strict";
const { Model } = require("sequelize");
const { arrayGet } = require("../util/util");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    validationRequest = async (action) => {
      let rules = {};
      switch (action) {
        case "create":
          rules = {
            validationRule: {
              first_name: "required",
              last_name: "required",
              email: "required|email",
              password: "required|min:6",
            },
            customMessage: {
              "required.name": "Name is required",
              "required.email": "Email is required",
              "require.password": "Password is required",
              "require.date_of_birth": "Birth date is required",
              "email.email": "Please enter valid email",
            },
          };
          break;
        case "update":
          rules = {
            validationRule: {
              first_name: "required",
              last_name: "required",
            },
            customMessage: {
              "required.first_name": "First Name is required",
              "required.last_name": "Last Name is required",
            },
          };
          break;
        default:
          rules = {};
      }
      return rules;
    };

    prepareUpdateData = async (newData, defaultData) => {
      let data = {};
      data["first_name"] = await arrayGet(
        "first_name",
        newData,
        defaultData["first_name"]
      );
      data["last_name"] = await arrayGet(
        "last_name",
        newData,
        defaultData["last_name"]
      );

      return data;
    };
  }
  User.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.TEXT,
      date_of_birth: DataTypes.STRING,
      role: DataTypes.BOOLEAN,
      is_deleted: DataTypes.BOOLEAN,
      full_name: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.first_name} ${this.last_name}`;
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
