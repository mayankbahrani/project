const express  = require("express");
const router = express.Router({mergeParams: true});
const app = express();
const mongoose = require("mongoose");
let port =8080;
const Listing = require("../models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-Mate");
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const {reviewSchema} = require("../schema");
const Review = require("../models/review");
const {validateReview, isOwner, isLoggedIn ,isAuthor} = require("../middleware");



app.set("view engine" , "ejs");
app.set("views engine" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const reviewController = require("../controllers/review");


//reviews
router.post("/" , isLoggedIn, validateReview, wrapAsync( reviewController.createReview ));

//delete review route
router.delete("/:reviewId" , isAuthor, wrapAsync( reviewController.deleteReview ));


module.exports = router;