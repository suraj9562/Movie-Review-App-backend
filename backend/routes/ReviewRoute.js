const express = require('express');
const { getAllReviews, postReview } = require('../controllers/ReviewController');
const { isAuthenticatedUser } = require('../middleware/auth');
const router = express.Router();


// fetching all reviews of particular movie
router.get("/movie/:id", getAllReviews);

//crating review -- authenticated user only
router.post("/movie/:id", postReview);

// updating review


//deleting review -- admin

module.exports = router;