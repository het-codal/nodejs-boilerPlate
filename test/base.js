const Model = require("../models/index");
const bcrypt = require("bcrypt");
const common = require("../util/util");
module.exports.token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6eyJmdWxsX25hbWUiOiJIZXQgUmFjaGgiLCJpZCI6MSwiZmlyc3RfbmFtZSI6IkhldCIsImxhc3RfbmFtZSI6IlJhY2hoIiwiZW1haWwiOiJocmFjaGhAY29kYWwuY29tIiwiZGF0ZV9vZl9iaXJ0aCI6IjE5OTctMDQtMTciLCJyb2xlIjpmYWxzZSwiaXNfZGVsZXRlZCI6ZmFsc2UsImNyZWF0ZWRBdCI6bnVsbCwidXBkYXRlZEF0IjpudWxsLCJ0b2tlbl9pZCI6MX0sImlhdCI6MTY2MzkyNTM3NSwiZXhwIjoxNjY0MDExNzc1fQ.d60O2sg7DeJiCaRPaNRTtaWwhYfBzVfu6DWMg4wXRvQ";

module.exports.createUser = async (data) => {
  data["password"] = bcrypt.hashSync(data.password, 10);
  const user = await common.cleanData(await Model.User.create(data));
  return user;
};
