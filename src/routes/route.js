const express=require('express')
const router=express.Router();
// book 
const Book=require('../controllers/bookcontroller')
//user
const User=require('../controllers/usercontroller')

//create the user
router.post("/register",User.userRegister)

// create the book
 router.post("/books",Book.createBook)
 router.get("/books",Book.getAllBooks)

//login user 
router.post("/login", User.userlogin)

// look the books
//  router.get("/books",)


  
module.exports=router