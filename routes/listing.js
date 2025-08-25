const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isloggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

//new route
router.get("/new", isloggedIn, listingController.renderNewForm);

//edit route
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router
  .route("/:id")
  .get(wrapAsync(listingController.renderListing))
  .put(
    isloggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isloggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
