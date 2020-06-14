const { admin, db } = require("./admin");

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  } else {
    console.log("No Token Found");
    return res.status(403).json({
      success: false,
      error: "Unauthorized",
    });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      db.collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get()
        .then((data) => {
          req.user.email = data.docs[0].data().email;
          req.user.isAdmin = data.docs[0].data().isAdmin;
          req.user.isStaff = data.docs[0].data().isStaff;
          req.user.isStudent = data.docs[0].data().isStudent;
          req.user.institute = data.docs[0].data().institute_id;
          next();
        })
        .catch((error) => {
          console.error(error);
          res.status(403).json({
            success: false,
            error,
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        error,
      });
    });
};
