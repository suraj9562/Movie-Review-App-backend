const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const database = require('./config/db')

app.use(bodyparser.json());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

dotenv.config({ path: "backend/config/config.env" });
const port = process.env.PORT || 5000;


app.get("/", (req, res)=>{
    return res.send("Hello world");
});

app.get("/api/getAllReviews",(req, res)=>{
 try {
     let data = '';
     database.query("SELECT * FROM movie_reviews", function (err, result, fields) {
        if (err) throw err;
        return res.status(200).json({
            success: true,
            result
        })
      });
 } catch (error) {
     console.error(error);
     return res.status(500).json({
        success: false,
        error
    })
 }
})

// import routes
const user = require('./routes/UseRoutes');
const movie = require("./routes/MoviewRoutes");
const review = require("./routes/ReviewRoute");

app.use("/api/user", user);
app.use("/api/movie", movie);
app.use("/api/reviews", review);


app.listen(port, ()=>{
    console.log(`server is rendering on http://localhost:${port}`);
})