const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../schema.js");

module.exports.index = async (req, res) => {
  const alllisting = await Listing.find({});
  res.render("listings/index.ejs", { alllisting });
};

module.exports.renderNewForm = (req, res, next) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  // let {title, description , image , price , location , country } = req.body;
  //  let newdata = await Listing.insertOne({
  //     title:title,
  //     description:description,
  //     image:image,
  //     price:price,
  //     location:location,
  //     country:country,
  //  }) ;

  // ek tareek ye hai ek isse chota hai
  //  newdata.save().then((res)=>{
  //     console.log(res);
  //  }).catch((err)=>{
  //     console.log(err);
  //  });

  //another way
  // let listing = req.body.listing;
  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = {url , filename};
  await newlisting.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", " Listing you requested does not exists ");
    return res.redirect("/listings");
  }
  let originalImageUrl  = listing.image.url;
  originalImageUrl.replace("/upload" , "/upload/w_250")

  res.render("listings/edit.ejs", { listing , originalImageUrl });
};

module.exports.renderListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", " Listing you requested does not exists ");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== "undefined" ){
  let url = req.file.path;
  let filename = req.file.filename
  listing.image = {url , filename};
  await listing.save();
  }
  req.flash("success", " listing Updated");
  res.redirect("/listings");
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleted Successfully");
  res.redirect("/listings");
};
