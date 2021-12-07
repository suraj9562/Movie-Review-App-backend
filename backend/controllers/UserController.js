const bcrypt = require("bcryptjs"); //used for hashing and salting
const jwt = require("jsonwebtoken");
const database = require("../config/db");

const jwt_sec = "movie_reviewer_by@group-1#a3";

exports.registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const salt = await bcrypt.genSalt(10);
    const securePass = await bcrypt.hash(password, salt);

    var sql = `INSERT INTO login(email, name, password) VALUES ('${email}', '${name}','${securePass}');`;
    database.query(sql, function (err, result) {
      if (err) {
        return res.status(400).json({
          success: false,
          message:
            "user Already exists with this email id Pls Use different email id.",
        });
      }

      const token = jwt.sign({ id: email }, jwt_sec, {
        expiresIn: "5d",
      });

      const options = {
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        httpOnly: true
      };

      return res.status(201).cookie("token", token, options).json({
        success: true,
        Token: token,
        result: "user"
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server Error.",
    });
  }
};

// user login
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    var sql = `SELECT EXISTS( SELECT password FROM login WHERE email = '${email}') AS p;`;
    database.query(sql, async function (err, result) {
      if (err) {
        return res.status(404).json({
          success: false,
          message: err,
        });
      }

      if(result[0].p == 0){
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      var sql_main = `SELECT password, type FROM login WHERE email = '${email}';`;
      database.query(sql_main, async function (err, result) {
        if (err) {
          return res.status(404).json({
            success: false,
            message: err,
          });
        }

        var string = JSON.stringify(result);
        var json = JSON.parse(string);

        const comparePassword = await bcrypt.compare(password, json[0].password);

        if (!comparePassword) {
          return res.status(400).json({
            success: false,
            message: "Pls Enter Valid Credentials.",
          });
        }

        const token = jwt.sign({ id: email }, jwt_sec, {
          expiresIn: "5d",
        });

        const options = {
          expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          httpOnly: true
        };

        return res.status(200).cookie("token", token, options).json({
          success: true,
          message: "User Logged In Successfully.",
          Token: token,
          result: json[0].type
        });

      });

    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal Server Error.",
    });
  }
};

// admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    var sql = `SELECT EXISTS( SELECT password FROM login WHERE email = '${email}') AS p;`;
    database.query(sql, async function (err, result) {
      if (err) {
        return res.status(404).json({
          success: false,
          message: err,
        });
      }

      if(result[0].p == 0){
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      var sql_main = `SELECT password, type FROM login WHERE email = '${email}';`;
      database.query(sql_main, async function (err, result) {
        if (err) {
          return res.status(404).json({
            success: false,
            message: err,
          });
        }

        var string = JSON.stringify(result);
        var json = JSON.parse(string);

        if(json[0].type === "admin"){
          const comparePassword = await bcrypt.compare(password, json[0].password);

          if (!comparePassword) {
            return res.status(400).json({
              success: false,
              message: "Pls Enter Valid Credentials.",
            });
          }
  
          const token = jwt.sign({ id: email }, jwt_sec, {
            expiresIn: "5d",
          });
  
          const options = {
            expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            httpOnly: true
          };
  
          return res.status(200).cookie("token", token, options).json({
            success: true,
            message: "Admin Logged In Successfully.",
            Token: token,
            result: json[0].type
          });
        }

        return res.status(401).json({
          success: false,
          message: "You are unauthorized user",
        });

      });

    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal Server Error.",
    });
  }
};

// logging out user
exports.userLogOut = (req, res) => {
  try {
    const options = {
      expires: new Date(Date.now()),
      httpOnly: true
    };

    return res.status(200).cookie("token", null, options).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal Server Error.",
    });
  }
};

// getting all users
exports.getAllUsers = (req, res) => {
  try {
    var sql = `SELECT * FROM login;`;
    database.query(sql, function (err, result) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err,
        });
      }

      return res.status(200).json({
        success: true,
        message: "users fetched successfully",
        result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal Server Error.",
    });
  }
};

// promote to admin
exports.makeAdmin = (req, res, next) => {
  try {
    const id = req.params.id;

    var sql = `UPDATE login SET type = 'admin' WHERE id = ${id};`;
    database.query(sql, function (err, result) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err
        });
      }

      return res.status(201).json({
        success: true,
        message: "Promoted to Admin"
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal Server Error.",
    });
  }
};

// fetch all admins
exports.getAllAdmins = (req, res) => {
  try {
    var sql = `SELECT * from login WHERE type = 'admin';`;
    database.query(sql, function (err, result) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Admins Fetched Successfully",
        result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal Server Error.",
    });
  }
};

// demote to user
exports.makeUser = (req, res) => {
  try {
    const id = req.params.id;

    var sql = `UPDATE login SET type = 'user' WHERE id = ${id};`;
    database.query(sql, function (err, result) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Demoted to User",
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal Server Error.",
    });
  }
};

exports.me = async (req, res) => {
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

      return res.status(200).json({
        success: true,
        message: "User Details Fetched successfully",
        result: result[0].type,
      })

    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal Server Error.",
    });
  }
};

