const express  = require("express");
const router = express.Router();
const app = express();
const mongoose = require("mongoose");
let port =8080;
const Listing = require("../models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-Mate");
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const {listingSchema} = require("../schema");
const {isLoggedIn , isOwner , validateListing} = require("../middleware");
const multer  = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({ storage });


app.set("view engine" , "ejs");
app.set("views engine" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const listingController = require("../controllers/listing");



//index route
router.get("/" , wrapAsync(listingController.index));
 
 
 //form to create new
 router.get("/new" , isLoggedIn , listingController.renderNewForm );
 
 //create route
 router.post("/" ,isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync( listingController.createNewListing ));

 //edit route 1 
router.get("/:id/edit" , isLoggedIn, isOwner, wrapAsync(listingController.editFormRender));

//edit route 2 
router.put("/:id" , isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync( listingController.editPost ));

//delete
router.delete("/:id" , isLoggedIn , isOwner, wrapAsync(listingController.deleteListing));

//show route
router.get("/:id" , wrapAsync( listingController.showList));

module.exports = router;