const { db, admin } = require("../util/admin");

exports.getUserList = (req, res) => {
  const { institute_id } = req.body;
  admin
    .auth()
    .listUsers()
    .then((listUsersResult) => {
      const users = listUsersResult.users;
      users.forEach((user) => console.log(user));
      res.status(200).json({
        success: 1,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: 0,
        error: error.message,
      });
    });
};
