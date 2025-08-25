const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isloggedIn = (req,res,next)=>{
      if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // passport isko delete kr deta hai isiliye hme isko local mein store kr deta hai
    req.flash("error" , "you must be logged in to create listing")
   return  res.redirect("/login");
  }
  next();
}


module.exports.saveRedirectUrl  = (req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
next();
} ;

module.exports.isOwner = async (req,res,next)=>{
let {id} = req.params;
let listing = await Listing.findById(id);
if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "You don't have permission")
    return res.redirect(`/listings/${id}`)
}
next();
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next(error);
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next(error);
  }
};

module.exports.isReviewAuthor = async (req,res,next)=>{
let {id , reviewId} = req.params;
let review = await Review.findById(reviewId);
if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You are not author of this review ")
    return res.redirect(`/listings/${id}`)
}
next();
}