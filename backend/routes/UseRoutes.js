const express = require('express');
const { registerUser, userLogin, userLogOut, getAllUsers, makeAdmin, getAllAdmins, makeUser, adminLogin, me } = require('../controllers/UserController');
const { isAuthenticatedUser, isAdmin } = require('../middleware/auth');
const router = express.Router();


// creating a user
router.post("/register", registerUser);
 
// logging in user
router.post("/login", userLogin);

// logging out user
router.get("/logout", userLogOut);

// user info
router.get("/me", me);

// ADMIN

// admin login
router.post("/adminLogin", adminLogin);

// get all users
router.get("/users", getAllUsers);

// promote to admin
router.post('/promote/:id' , makeAdmin);

// promote to admin
router.post('/demote/:id' , makeUser);

// fetch all admins
router.get('/admins' , getAllAdmins);

module.exports = router;