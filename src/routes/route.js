const express=require('express')
const router=express.Router();

//Book 
const Book=require('../controllers/bookcontroller')
//user
const User=require('../controllers/usercontroller')
//review 
const Review= require('../controllers/reviewcontroller')
//Authentication
const auth = require('../middleware/Authentication')
//create the user
router.post("/register",User.userRegister)

// create the book
 router.post("/books",auth.mid1, auth.mid3,Book.createBook)
 router.get("/books" ,auth.mid1, Book.getAllBooks)
 router.delete("/books/:bookId" ,auth.mid1, auth.mid2, Book.deleteBookBYId)
 router.put("/books/:bookId" ,auth.mid1, auth.mid2, Book.updateBook)
 router.get("/books/:bookId",auth.mid1,Book.getBookById)

// Review
 router.post("/books/:bookId/review" ,Review.createreview)
 router.put("/books/:bookId/review/:reviewId" ,Review.updateReview)
 router.delete("/books/:bookId/review/:reviewId" ,Review.deleteReview)
 router.put("/url/:bookId",Book.urlimage)
//login user 
router.post("/login", User.userlogin)



module.exports=router