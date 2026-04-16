const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

//disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    crypto.randomBytes(16, (err, bytes) => {
        // console.log(bytes.toString("hex"));
        const fn = bytes.toString("hex") + path.extname(file.originalname);
        cb(null, fn)
    });
  }
})

const upload = multer({ storage: storage })  

module.exports = upload;
