const express = require("express");
const { createMovie, getAllMovies, deleteMovie, updateMovieDetails, getParticularMovie } = require("../controllers/MovieController");
const { isAuthenticatedUser, isAdmin } = require("../middleware/auth");
const router = express.Router();

// create movie --admin
router.post('/create', createMovie);

// update movie -- admin
router.put('/update/:id', updateMovieDetails);

// delete movie --admin
router.delete('/delete/:id', deleteMovie);

// fetch all movies
router.get('/allmovies', getAllMovies);

// get particular movie
router.get("/allmovies/:id", getParticularMovie);

module.exports = router;