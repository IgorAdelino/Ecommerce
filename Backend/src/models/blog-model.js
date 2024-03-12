const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numberOfViews:{
        type: Number,
        default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    image: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrMyN7VX02FH4Jo_NmxwjkOmPH5KHA1cG9nhAfIeZsaQ&s"
    },
    author: {
      type: String,
      default: "Admin"
    },
    images: {
      type: Array,
    },
},{
  toJSON: { virtuals: true }, toObject: { virtuals: true }
},{
  timestamps: true
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);