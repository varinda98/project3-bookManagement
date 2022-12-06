const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const bookModel= require("../Models/bookModel")
const mid1= async (req,res,next)=>{
    try{
    let token = req.headers["x-api-key"];
    //If no token is present in the request header return error. This means the user is not logged in.
    if (!token)
    return res.send({ status: false, message:"token must be present" });
    
     try{
        var decodedToken = jwt.verify(token, "Alone-But-Happy");
     }
     catch(err){
      return res.status(401).send({ status: false, message: "token is invalid" });
    }
    req.abc=decodedToken;
    
    next();
    }
    catch(error){
        res.status(500).send({status:false,message:error.message})
    }  
}
const mid2=async (req,res,next)=>{
  try{
  let bookId = req.params.bookId;
  if(!isValidObjectId(bookId))
  return res.status(400).send({status:false,message:"Please enter correct bookId"})
  let data= await bookModel.findById(bookId)
  if(!data){
    return res.status(404).send({status:false,message:"book is not exits"})
  }
  if(req.abc.userId==data.userId)
  next();
  else
  return res.status(403).send({status:false,msg:"not authorized"})
  }
  catch(err){
    return res.status(500).send({status:false,message:err.message})
  }
}
const mid3=async (req,res,next)=>{
  let userId = req.body.userId;
  if(!isValidObjectId(userId))
  return res.status(400).send({status:false,message:"Please enter correct userId"})
  if(req.abc.userId===userId)
    next();
  else
  return res.status(403).send({status:false,msg:"not authorized"})
}
module.exports.mid1=mid1
module.exports.mid2=mid2
module.exports.mid3=mid3