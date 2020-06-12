const admin = require("firebase-admin");
var serviceAccount = require("../service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ielts-preps.firebaseio.com",
  storageBucket: "ielts-preps.appspot.com",
});

const db = admin.firestore();

module.exports = { admin, db };
