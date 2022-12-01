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
 router.post("/books" ,Book.createBook)
 router.get("/books" ,Book.getAllBooks)
 router.put("/books/:bookId" ,auth.mid1, auth.mid2, Book.deleteBookBYId)
 router.patch("/books/:bookId" ,auth.mid1, auth.mid2, Book.updateBook)
 router.get("/books/:bookId" ,Book.getBookById)

// Review
 router.post("/books/:bookId/review" ,Review.createreview)
 router.post("/books/:bookId/review/:reviewId" ,Review.updateReview)
 router.post("/books/:bookId/review/:reviewId" ,Review.deleteReview)
 
//login user 
router.post("/login", User.userlogin)

module.exports=router