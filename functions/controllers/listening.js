const { db } = require("../util/admin");

exports.addModule = (req, res) => {
  const { type, audioUrl, pdfUrl, videoUrl, answers } = req.body;

  if (req.user.isAdmin || req.user.isStaff) {
    console.log(req.body);
    db.collection("listening")
      .add({
        type,
        audioUrl,
        pdfUrl,
        videoUrl,
        answers,
        addedBy: req.user.email,
        institute_id: req.user.institute,
        createdAt: new Date().toISOString(),
      })
      .then(() => {
        res.status(201).json({
          success: true,
        });
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      });
  } else {
    res.status(403).json({
      success: false,
      error: "Unauthorized",
    });
  }
};
