const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isreviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isreviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
