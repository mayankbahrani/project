const Review = require("../models/review");
const Listing = require("../models/listing");
const User = require("../models/user");


module.exports.signup = (req,res) => {

    res.render("users/signup.ejs");
 
};


module.exports.storeNewUser = async (req,res) => {
    try{
        let {username , email , password } = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser , password);
        req.login(registeredUser , (err) => {
            if(err){
                next(err);
            }

            req.flash("success" , "Welcome to Wanderlust!");
        return res.redirect("/listings");

        })
        
    }catch(e){
        req.flash("error" , e.message);
        return res.redirect("/signup");
    
    }   
};


module.exports.login =  (req,res) => {
    res.render("users/login.ejs");
};

module.exports.loginNew = async(req,res) => {
   
    req.flash("success" , "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};


module.exports.logout =  (req,res,next) => {
    req.logout((err) => {
        if(err){
        return next(err);
        }
   
    
        req.flash("success" , "you are logged out");
        res.redirect("/listings");
    });
};