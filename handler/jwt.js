const { expressjwt } = require("express-jwt");
require("dotenv/config");

function jwt() {
  const secret = process.env.secret;
  return expressjwt({ secret, algorithms: ["HS256"] }).unless({
    path: [
      // public routes that don't require authentication
      "/api/login",
      "/api/signup",
      "/api/swagger",
      "/api/swagger-ui",
    ],
  });
}

module.exports = jwt;
