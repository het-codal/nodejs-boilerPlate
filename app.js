const express = require("express");
const swaggerUi = require("swagger-ui-express");
const jwt = require("./handler/jwt");
const errorHandler = require("./handler/error");
const cors = require("cors");
let morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(cors());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    explorer: true,
    swaggerUrl: "/api/swagger",
    customSiteTitle: "API",
  })
);

app.use(jwt());
if (process.env.NODE_ENV != "test") {
  app.use(morgan("combined"));
}
require("./routes")(app);
app.get("*", (req, res) => {
  res.status(200).json({ message: "Hello" });
});

app.use(errorHandler);
const PORT = 8000;
app.listen(PORT, console.log("App is running"));

module.exports = app;
