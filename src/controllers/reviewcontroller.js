const bookModel= require ("../Models/bookModel")
const reviewModel = require("../Models/reviewModel")
const { isValidObjectId } = require('mongoose');
const moment = require('moment');


const createreview=async (req,res)=>{
   
    try{
    let bookId = req.params.bookId
    let data=req.body
    if(Object.keys(data).length == 0){
        return res.status(400).send({status:false,message:"body is not define"})
      }
    // bookid validation
    if (!bookId) {
      return res.status(400).send({ status: false, message:"Please provide bookid" })
  }
  if (!isValidObjectId(bookId)) {
    return res.status(400).send({ status: false, message: "Invalid BookId" });
  }
     let bookcheck= await bookModel.findOne({_id:bookId});
     if(!bookcheck){
      return res.status(404).send({status:false,message:"book is not find"})
     }
    
    let {reviewedBy,rating,review} = data
  
  if (!reviewedBy) {
    return res.status(400).send({ status: false, message:"Please provide reviewedBy" })
  }
  
  if (!rating) {
    return res.status(400).send({ status: false, message:"Please provide rating" })
  }
  if (!review) {
    return res.status(400).send({ status: false, message:"Please provide review" })
  } 
  data.reviewedAt=moment().format("YYYY-MM-DD");
  data.bookId=bookId;
  let finalreview = await  reviewModel.create(data)  
   return res.status(201).send({status:true,message:finalreview})
  }
    catch(err){
      res.status(500).send({status:false,message:err.message})
    }
  }
  
  module.exports.createreview=createreview;