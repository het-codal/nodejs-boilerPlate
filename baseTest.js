require("dotenv/config");
const fs = require("fs");
const child_process = require("child_process");
const dataBasePath = "./database.sqlite3";
if (fs.existsSync(dataBasePath)) {
  fs.unlinkSync(dataBasePath);
}
child_process.execSync("npx sequelize-cli db:migrate", {
  stdio: [0, 1, 2],
});
child_process.execSync("npx sequelize-cli db:seed:all", { stdio: [0, 1, 2] });
