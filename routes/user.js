const express  = require("express");
const app = express();
const router = express.Router({mergeParams: true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");


app.use(express.urlencoded({extended : true}));

const userController = require("../controllers/user");

router.get("/signup" ,userController.signup);

router.post("/signup" , wrapAsync(userController.storeNewUser));


router.get("/login" ,userController.login);


router.post("/login" , saveRedirectUrl 
    , passport.authenticate("local" , { 
        failureRedirect: '/login' , 
        failureFlash : true 
    }) ,
      wrapAsync( userController.loginNew));



router.get("/logout" , userController.logout);




module.exports=router;
