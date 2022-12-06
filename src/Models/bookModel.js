const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        unique : true,
        trim:true
    },
    excerpt : {
        type : String,
        required : true,
        trim:true
    },
    userId : {
        type : ObjectId,
        required : true,
        ref : "P3-user"
    },
    ISBN : {
        type :String,
        required : true,
        unique : true
    },
    category : {
        type : String,
        required : true,
        trim:true
    },
    subcategory : {
        type : String,
        required : true,
        trim:true
    },
    bookCover:{
        type:String,
        default:""       
    },
    reviews: {
        type : Number,
        default : 0
    },
    deletedAt: {
       type:Date,
       default:""
    },

    isDeleted : {
        type : Boolean,
        default : false
    },
    releasedAt : {
       type:Date,
       required:true
    }
    
},{timestamps : true})

module.exports = mongoose.model("BookModel",bookSchema)