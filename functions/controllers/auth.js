const firebase = require("firebase");
const config = require("../util/config");
const { db, admin } = require("../util/admin");

firebase.initializeApp(config);

exports.login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Email cannot be empty",
      });
    }

    if (password.trim() === "") {
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
            let roleData = "";
            if (doc.data().isAdmin) {
              roleData = "admin";
            }
            if (doc.data().isStaff) {
              roleData = "staff";
            }
            if (doc.data().isStudent) {
              roleData = "student";
            }
            res.status(200).json({
              success: true,
              token,
              role: roleData,
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

    if (role.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Select Role",
      });
    }

    if (email.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Email cannot be empty",
      });
    }

    if (password.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Password cannot be empty",
      });
    }

    if (repeatPassword.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Repeat Password cannot be empty",
      });
    }

    if (firstname.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "First Name cannot be empty",
      });
    }

    if (lastname.trim() === 0) {
      return res.status(400).json({
        success: false,
        error: "Last Name cannot be empty",
      });
    }

    if (institute_id.trim() === "") {
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
          createdAt: new Date().toISOString(),
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

exports.deleteMember = (req, res) => {
  const { deleteEmail, deleteUserId, deleteUserType } = req.body;

  if (deleteUserType === "staff") {
    if (req.user.isAdmin) {
      deleteUserFromSystem(deleteEmail, deleteUserId, res);
    } else {
      res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }
  }
  if (deleteUserType === "student") {
    if (req.user.isAdmin || req.user.isStaff) {
      deleteUserFromSystem(deleteEmail, deleteUserId, res);
    } else {
      res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }
  }
  res.json({
    success: 1,
  });
};

function deleteUserFromSystem(deleteEmail, deleteUserId, res) {
  admin
    .auth()
    .deleteUser(deleteUserId)
    .then(() => {
      db.doc(`/users/${deleteEmail}`)
        .delete()
        .then((result) => {
          res.status(200).json({
            success: true,
            result,
          });
        });
    })
    .catch((error) => {
      res.status(403).json({
        success: false,
        error,
      });
    });
}
