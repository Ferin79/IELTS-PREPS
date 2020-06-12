const functions = require("firebase-functions");
const express = require("express");
const { login, register } = require("./controllers/auth");

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
exports.api = functions.https.onRequest(app);
