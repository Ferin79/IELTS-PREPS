const functions = require("firebase-functions");
const express = require("express");
const { login, register, deleteMember } = require("./controllers/auth");
const checkAuth = require("./util/checkAuth");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
  next();
});

app.post("/login", login);
app.post("/register", register);
app.post("/delete-member", checkAuth, deleteMember);
exports.api = functions.https.onRequest(app);
