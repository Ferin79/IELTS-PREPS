const firebase = require("firebase");
const config = require("../util/config");
const { db } = require("../util/admin");

firebase.initializeApp(config);

exports.login = (req, res, next) => {
  try {
    const { role, email, password } = req.body;

    if (role.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Select Role",
      });
    }

    if (email.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Email cannot be empty",
      });
    }

    if (password.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Password cannot be empty",
      });
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((data) => {
        const token = data.user.getIdToken();
        return token;
      })
      .then((token) => {
        db.doc(`users/${email}`)
          .get()
          .then((doc) => {
            res.status(200).json({
              success: true,
              token,
              role,
              institute_id: doc.data().institute_id,
            });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.register = (req, res, next) => {
  try {
    const {
      role,
      email,
      password,
      firstname,
      lastname,
      repeatPassword,
      institute_id,
    } = req.body;

    if (role.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Select Role",
      });
    }

    if (email.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Email cannot be empty",
      });
    }

    if (password.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Password cannot be empty",
      });
    }

    if (repeatPassword.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Repeat Password cannot be empty",
      });
    }

    if (firstname.length === 0) {
      return res.status(400).json({
        success: false,
        error: "First Name cannot be empty",
      });
    }

    if (lastname.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Last Name cannot be empty",
      });
    }

    if (institute_id.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Institue Id cannot be empty",
      });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({
        success: false,
        error: "Password Did not Match",
      });
    }

    let token = "";
    let userId = "";

    db.doc(`/users/${email}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return res.status(400).json({
            success: false,
            error: "This Email Address is already in use",
          });
        } else {
          return firebase
            .auth()
            .createUserWithEmailAndPassword(email, password);
        }
      })
      .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
      })
      .then((idToken) => {
        token = idToken;
        const roleTab = {
          isAdmin: false,
          isStaff: false,
          isStudent: false,
        };
        if (role === "admin") {
          roleTab.isAdmin = true;
        } else if (role === "staff") {
          roleTab.isStaff = true;
        } else if (role === "student") {
          roleTab.isStudent = true;
        } else {
        }
        const userCredentails = {
          firstname,
          lastname,
          email,
          institute_id,
          createdAt: new Date().toISOString(),
          userId,
          ...roleTab,
        };
        return db.doc(`/users/${email}`).set(userCredentails);
      })
      .then(() => {
        return res.status(201).json({
          success: true,
          token,
          role,
          institute_id,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          success: false,
          error: error.message,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};
