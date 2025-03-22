const Listing = require("./models/listing");
const Review = require("./models/review");
const expressError = require("./utils/expressError");
const {listingSchema} = require("./schema");

const {reviewSchema} = require("./schema");


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in before you add a new listing");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curUser._id)){
        req.flash("error" , "You don't have permission to delete");
        return res.redirect("/listings");
    }
    next();
};


// validate krega server side pe for creating
module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        throw new expressError(400, error);
    }else{
        next();
    }
};

// validate krega server side pe for reviewing 
module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        throw new expressError(400, error);
    }else{
        next();
    }
};

module.exports.isAuthor= async(req,res,next) => {
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.curUser._id)){
        req.flash("error" , "You don't have permission to delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
};