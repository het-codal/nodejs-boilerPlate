let chai = require("chai");
let chaiHttp = require("chai-http");
var should = chai.should();
let server = require("../app");
chai.use(chaiHttp);
let base = require("./base");
let token = base.token;
const baseURL = "/api/user";
describe("User", async () => {
  describe("/GET users", async () => {
    it("it should GET all the users with out token", (done) => {
      chai
        .request(server)
        .get(baseURL)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it("it should GET all the users", (done) => {
      chai
        .request(server)
        .get(baseURL)
        .set({ Authorization: token })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("it should GET all the users with query params", (done) => {
      chai
        .request(server)
        .get(baseURL)
        .query({ size: 10, page: 2 })
        .set({ Authorization: token })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("it should GET all the users with sorting", (done) => {
      chai
        .request(server)
        .get(baseURL)
        .query({ sortKey: "id", sortBy: "DESC" })
        .set({ Authorization: token })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("it should GET Single User", (done) => {
      chai
        .request(server)
        .get(baseURL + "/1")
        .set({ Authorization: token })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("it should not GET Single User", (done) => {
      chai
        .request(server)
        .get(baseURL + "/1000")
        .set({ Authorization: token })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe("/POST users", async () => {
    it("it should not POST the users with out token", (done) => {
      const user = {
        email: "test@yopmail.com",
        password: "test123",
        first_name: "Test",
        last_name: "User",
      };
      chai
        .request(server)
        .post(baseURL)
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it("it should POST the user", (done) => {
      const user = {
        email: "test@yopmail.com",
        password: "test123",
        first_name: "Test",
        last_name: "User",
      };
      chai
        .request(server)
        .get(baseURL)
        .set({ Authorization: token })
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("it should not POST the user without proper data", (done) => {
      const user = {
        password: "test123",
        first_name: "Test",
        last_name: "User",
      };
      chai
        .request(server)
        .post(baseURL)
        .set({ Authorization: token })
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
