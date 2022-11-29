const express=require('express')
const router=express.Router();
// book 
const Book=require('../controllers/bookcontroller')
//user
const User=require('../controllers/usercontroller')
//review 
const Review= require('../controllers/reviewcontroller')

//create the user
router.post("/register",User.userRegister)

// create the book
 router.post("/books" ,Book.createBook)
 router.get("/books" ,Book.getAllBooks)
 router.put("/books/:bookId" ,Book.deleteBookBYId)
 router.post("/books/:bookId/review" ,Review.createreview)
 router.patch("/books/:bookId", Book.updateBook)

//login user 
router.post("/login", User.userlogin)



  
module.exports=router