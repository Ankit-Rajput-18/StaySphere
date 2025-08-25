const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalManager =  require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type : String,
        required : true,
    },
});


userSchema.plugin(passportLocalManager);

module.exports = mongoose.model("User" , userSchema);