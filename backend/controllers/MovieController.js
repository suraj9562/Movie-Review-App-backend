const { request } = require('express');
const database = require('../config/db');

exports.createMovie = (req, res) =>{
    try {

        const {movieName, movieUrl, movieDesc, movieDuration} = req.body;

        var sql = `INSERT INTO movies(name, bannerUrl, description, duration) VALUES ('${movieName}', '${movieUrl}', '${movieDesc}', '${movieDuration}');`
        database.query(sql, function(err, result){
            if(err){
                return res.status(400).json({
                    success: false,
                    message: err
                });
            }

            return res.status(201).json({
                success: true,
                message: "Movie added to db successfully"
            })
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// update movie
exports.updateMovieDetails = (req, res) =>{
    try {
        const id = req.params.id;
        const {movieName, movieUrl, movieDesc, movieDuration} = req.body;

        var sql = `UPDATE movies 
        SET 
            name = '${movieName}',
            bannerUrl = '${movieUrl}',
            description = '${movieDesc}',
            duration = '${movieDuration}'
        WHERE
            id = ${id};`
        database.query(sql, function(err, result){
            if(err){
                return res.status(404).json({
                    success: false,
                    message: "Movie Not Found"
                });
            }

            return res.status(201).json({
                success: true,
                message: "Movie Updated successfully"
            })
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// delete particular Movie
exports.deleteMovie = (req, res) =>{
    try {
        const id = req.params.id;
        var sql = `DELETE FROM movies WHERE id=${id} LIMIT 1;`;
        database.query(sql, function(err, result){
            if(err){
                return res.status(404).json({
                    success: false,
                    message: "Movie Not Found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Movie deleted from db successfully"
            })
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// get all movies
exports.getAllMovies = (req, res)=>{
    try {

        var sql = `select * from movies;`;
        database.query(sql, function (err, result) {
            if (err){
                return res.status(400).json({
                    success: false,
                    message: err
                });
            }

            return res.status(200).json({
                success: true,
                message: "data fetched successfully",
                result
            })
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// get particular movie
exports.getParticularMovie = (req, res) =>{
    try {

        const id = req.params.id;

        var sql = `SELECT * FROM movies WHERE id = ${id};`;
        database.query(sql, function(err, result){
            if(err){
                return res.status(404).json({
                    success: true,
                    message: "Product Not Found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "movie fetched successfully",
                id: result[0].id,
                result
            })
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
