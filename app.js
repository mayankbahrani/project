if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
let port =8080;
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
const {listingSchema , reviewSchema} = require("./schema");
const Review = require("./models/review");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");


const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const { createDiffieHellmanGroup } = require('crypto');

app.set("view engine" , "ejs");
app.set("views engine" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dbUrl = process.env.ATLAS_DB;


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,

});

store.on("error" ,() => {
    console.log("error on mongo session",err);
} ); 

const sessionOptions = {
    store,
    secret:process.env.SECRET ,
    resave:false , 
    saveUninitialized: true , 
    cookie:{
        expires: Date.now() + 7*24*60*60*1000, 
        maxAge:7*24*60*60*1000 , 
        httpOnly: true
    }


}



app.use(session(sessionOptions));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





async function main() {
    await mongoose.connect(dbUrl);
    
}

main()
.then((res) => {
    console.log("connection established");
})
.catch((err) => {
    console.log(err);
});










app.listen(port , () => {
    console.log("listening to port 8080");
});





/* app.get("/" , (req,res) => {
    res.send("root is working");
}); */





app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
});

app.use("/listings" , listingRouter);

app.use("/listings/:id/reviews" , reviewRouter );

app.use("/",userRouter);

//koi invalid route pe gaya toh custom error
app.all("*" , (req,res, next) => {
    next(new expressError(404,"Page Not Found"));
});

//error handling
app.use((err,req,res,next) => {
    let {statusCode = 500, message = "something went wrong "} = err;
    res.render("listings/error.ejs" , {message});
});