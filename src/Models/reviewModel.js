const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const reviewschema = new mongoose.Schema(
  {
    bookId: { 
        type:ObjectId,
        required: true,
         ref: "" 
        },

    reviewedBy: {
      type: String,
      required: true,
      default: "Guest",
      value: String,
    },

    reviewedAt: { 
        type:String,
        required:true 
    },
    
    rating: { 
    type: Number, 
    required: true,
    min:1,
    max:5 
},
    review: {
        type:String,
        trim: true
    },
    isDeleted: { 
        type:Boolean,
        default: false 
    }
  },
  { timestamps: true }
); // createdAt, updatedAt

module.exports = mongoose.model("review", reviewschema);
