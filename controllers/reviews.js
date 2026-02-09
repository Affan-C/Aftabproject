const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {

  const { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError(404, "Listing Not Found");
  }

  let review = new Review(req.body.review);
  review.author = req.user._id;
  await review.save();

  listing.reviews.push(review);
  await listing.save();
  req.flash("success", "New Review Created");

  res.redirect(`/listings/${listing._id}`);
};


module.exports.deleteReview = async (req, res) => {

  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " Review Deleted");
  res.redirect(`/listings/${id}`);
};