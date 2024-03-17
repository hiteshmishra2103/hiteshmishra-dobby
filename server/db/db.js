const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: String,
});

const imagesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  //imgurl will contain the array of the image urls associated with the user 
  url: [String],
})

const User = mongoose.model('User', userSchema);
const Images = mongoose.model('Images', imagesSchema);

module.exports = { User, Images }
