const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing");
        return res.redirect("/login");
    } 
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    // यहाँ req.user use करें, res.locals.currentUser नहीं
    if(!listing.owner._id.equals(req.user._id)){
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(e => e.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(e => e.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};

module.exports.isreviewAuthor = async(req, res, next) => {
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    // यहाँ भी req.user use करें
    if(!review.author._id.equals(req.user._id)){
        req.flash("error", "You did not create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};