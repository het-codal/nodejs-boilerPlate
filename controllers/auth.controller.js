const Model = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Validator = require("validatorjs");
const util = require("../util/util");
require("dotenv/config");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The Authentication managing API
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Authentication:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user name
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 */

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Authentication'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       500:
 *         description: Some server error
 */
module.exports.login = async (req, res, next) => {
  try {
    let data = req.body;
    const user = await Model.User.findOne({
      where: {
        email: data.email,
        is_deleted: 0,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const secret = process.env.secret;
    if (bcrypt.compareSync(data.password, user.password)) {
      const userData = await util.cleanData(user);
      delete userData.password;
      var date = new Date();
      const expiry = date.setDate(date.getDate() + 1);
      const authToken = await Model.Auth.create({
        user_id: userData.id,
        expires_at: expiry,
      });
      userData["token_id"] = authToken.id;
      const token = jwt.sign(
        {
          userData,
        },
        secret,
        { expiresIn: "1d" } //1 day it will expire
      );
      authToken.update({ token: token });
      const response = {
        token: token,
        user: user,
      };
      return res
        .status(200)
        .json({ data: response, message: "Logged in success" });
    }
    return res.status(404).json({ message: "Email Id/Password is wrong" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

/**
 * @openapi
 * /signup:
 *   post:
 *     summary: Signup new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       500:
 *         description: Some server error
 */
module.exports.signup = async (req, res, next) => {
  try {
    let data = req.body;
    const UserModel = new Model.User();
    const validationRules = await UserModel.validationRequest("create");
    const validate = new Validator(data, validationRules);
    if (validate.fails()) {
      return res.status(400).json({ message: validate.errors });
    }
    const isRegisterd = await Model.User.findOne({
      where: {
        email: data.email,
        is_deleted: 0,
      },
    });
    if (isRegisterd) {
      return res.status(400).json({ message: "You are already registred" });
    }
    data["password"] = bcrypt.hashSync(data.password, 10);
    data["role"] = 1;
    const userSave = await Model.User.create(data);
    return res
      .status(200)
      .json({ data: userSave, message: "User Created SuccessFully" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
