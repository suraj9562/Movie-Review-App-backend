const jwt = require("jsonwebtoken");
const database = require("../config/db");

const jwt_sec = "movie_reviewer_by@group-1#a3";

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please Login to access this resource",
      });
    }

    const data = jwt.verify(token, jwt_sec);
    var sql = `SELECT * FROM login WHERE email = '${data.id}';`;
    database.query(sql, async function (err, result) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err,
        });
      }
    });

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal Server Error.",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  const { token } = req.cookies;
  const role = "admin";

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please Login to access this resource",
    });
  }

  const data = jwt.verify(token, jwt_sec);
  var sql = `SELECT * FROM login WHERE email = '${data.id}';`;
  database.query(sql, function (err, result) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err,
      });
    }

    var string = JSON.stringify(result);
    var json = JSON.parse(string);

    if (json[0].type !== role) {
      return res.status(403).json({
        success: false,
        message: `Role: ${json[0].type} is not allowed to access this resouce.`,
      });
    }

    next();
  });
};
