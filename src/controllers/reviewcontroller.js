const bookModel= require ("../Models/bookModel")
const reviewModel = require("../Models/reviewModel")
const { isValidObjectId } = require('mongoose');
const moment = require('moment');
const validator= require("../regex");

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
     let bookcheck= await bookModel.findOne({_id:bookId,isDeleted:false});
     if(!bookcheck){
      return res.status(404).send({status:false,message:"book is not exits"})
     }
    
    let {reviewedBy,rating,review} = data
  
  // if (!reviewedBy) {
  //   return res.status(400).send({ status: false, message:"Please provide reviewedBy" })
  // }
  if (!rating ||(rating < 1 || rating > 5)) {
    return res.status(400).send({ status: false, message:"Please provide rating between 1 to 5"})
  }
   if (!review) {
    return res.status(400).send({ status: false, message:"Please provide review" })
  } 
  let countreview= await  reviewModel.find({bookId:bookId,isDeleted:false});
  data.reviewedAt=moment().format("YYYY-MM-DD");
  data.bookId=bookId;
  let finalreview = await  reviewModel.create(data)
  let total=countreview.length+1
  let updateReview = await bookModel.updateOne({_id:bookId},{$set:{reviews:total}})

   return res.status(201).send({status:true,data:finalreview})
  }
    catch(err){
      res.status(500).send({status:false,message:err.message})
    }
  }
  const updateReview = async function(req, res) {
    try {
      const filteredData = {};
  
      const book = req.params.bookId;
      if (!book) {
        return res.status(400).send({status: false,message: "Please enter the BookId"});}
         
      if (!isValidObjectId(book)) {
        return res.status(400).send({status: false,message: "Book Id is not valid"});}
           
      const existBook = await bookModel.findOne({ _id:book,isDeleted:false }).lean();
      if (!existBook) {
        return res.status(404).send({status:false,message: "No data found"});}
  
      const paramreview = req.params.reviewId;
      if (!isValidObjectId(paramreview)) {
       return  res.status(400).send({status: false,message: "review Id is not valid"});}
  
      const existReview = await reviewModel.findOne({_id: paramreview,bookId:existBook._id,isDeleted: false});
     
      if (!existReview) {
      return res.status(404).send({status: false,message: "No data found"});}
  
      const requestBody = req.body;
      if (!requestBody) {
      return res.status(400).send({status: false,message: "required some mandatory data"});}
  
      const { review, rating, reviewedBy } = requestBody;
      
      if (reviewedBy) {
        if (!validator.isValid(reviewedBy)) {
          return res.status(400).send({status: false,message: "typesss must be string and required some data inside string"});}
  
        if(!/^([A-Za-z ]){1,100}$/.test(reviewedBy)){
          return res.status(400).send({status: false,message: "reviewedBy should be in alphabets"})}
  
      }
  
      if (rating !== undefined) {
        if (!isValid(rating) || typeof rating !== "number") {
          return res.status(400).send({status: false,message: "rating is required and type must be Number"});}
  
        if (rating < 1 || rating > 5) {
        return res.status(400).send({status: false,message: "rating should be between 1 to 5"});}
      }
  
      if (review) {
        if (!validator.isValid(review)) {
        return res.status(400).send({status:false,message:"type must be string and required some data inside string"});}
      }
  
      const updateReview = await reviewModel.findByIdAndUpdate({ _id: paramreview },{ $set: requestBody },{ new: true }).select({_id:1, bookId:1, reviewedBy:1, reviewedAt:1, rating:1, review:1});
     
      if (updateReview) {
        existBook.reviewsData=updateReview
         
        return res.status(200).send({status: true,message: "Success",data: existBook});
      }
    } catch (err) {
      return res.status(500).send({status: false,message: err.message});}
  };

  const deleteReview = async function (req, res) {
    try {

        let bookId = req.params.bookId;
        
        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "Please enter valid bookId...!" })

        const bookExist = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ deletedAt: 0 })

        if (!bookExist)
            return res.status(404).send({ status: false, message: "No such book found...!" });

        
        let reviewId = req.params.reviewId;

        if (!isValidObjectId(reviewId))
            return res.status(400).send({ status: false, message: "enter valid reviewId...!" })

        
        const reviewExist = await reviewModel.findOne({ _id: reviewId, bookId: bookId })

        if (!reviewExist) return res.status(404).send({ status: false, message: "review not found...!" })
        let countreview= await  reviewModel.find({bookId:bookId,isDeleted:false}).count();
        let total=countreview
        
        let updateReview = await bookModel.updateOne({_id:bookId},{$set:{reviews:total}})
      

        if (reviewExist.isDeleted == true)
            return res.status(404).send({ status: false, data: "review is already deleted...!" })
        if (reviewExist.isDeleted == false) {   
            await reviewModel.findOneAndUpdate(
                { _id: reviewId, bookId: bookId, isDeleted: false },
                { $set: { isDeleted: true } },
                { new: true }
            );

            const addCount= await bookModel.findOneAndUpdate({_id:bookId},{$inc:{reviews:-1}},  {new:true})

            return res.status(200).send({ status: true, msg: 'successfully deleted review' });
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}
  
  module.exports.createreview=createreview;
  module.exports.updateReview=updateReview;
  module.exports.deleteReview=deleteReview;