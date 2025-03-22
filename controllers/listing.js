const Listing = require("../models/listing");

module.exports.index =  async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
 };

 module.exports.renderNewForm = (req,res) => {
    
    res.render("listings/create.ejs");
 };


 module.exports.createNewListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success" , "New Listing created");
    res.redirect("/listings");
};

module.exports.editFormRender =   async (req,res) => {
    let {id} = req.params;
    const listing  = await Listing.findById(id);

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_25");
    res.render("listings/edit.ejs" , {listing , originalImageUrl});
    
}

module.exports.editPost = async (req,res) => {
    
    let {id} = req.params;

    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    res.redirect("/listings");

};

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted");
    res.redirect("/listings");

};

module.exports.showList = async (req,res) => {
    let {id} = req.params;
    let list = await Listing.findById(id).populate({path: "reviews" , populate: {path: "author"}}).populate("owner");
    if(!list){
        req.flash("error" , "The List you are searching for does not exist");
        return res.redirect("/login");
    }
    res.render("listings/show.ejs" , {list});
};