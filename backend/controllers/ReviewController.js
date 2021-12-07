const database = require("../config/db");
const mysql = require('mysql');

exports.getAllReviews = (req, res) =>{
    try {

        const id = req.params.id;
        var sql = `SELECT * FROM movie_reviews WHERE movieid = ${id}`;
        database.query(sql, function(err, result) {
            if(err){
                return res.status(400).json({
                    success: true,
                    message: err
                });
            }

            return res.status(200).json({
                success: true,
                message: "All reviews are fetched",
                result
            });
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// post a review
exports.postReview = (req, res) =>{
    try {
        const id = req.params.id;
        const { movieReview } = req.body;
        var sql = `INSERT INTO movie_reviews(movieReview, movieID) VALUES ('${movieReview}', '${id}')`;
        database.query(sql, function(err, result) {
            if(err){
                return res.status(400).json({
                    success: true,
                    message: err
                });
            }

            return res.status(200).json({
                success: true,
                message: "Review Posted Successfully."
            });
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}