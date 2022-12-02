const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const bookModel= require("../Models/bookModel")
const mid1= async (req,res,next)=>{
    try{
    let token = req.headers["x-api-key"];
    //If no token is present in the request header return error. This means the user is not logged in.
    if (!token)
    return res.send({ status: false, message:"token must be present" });
    
     
        let decodedToken = jwt.verify(token, "Alone-But-Happy");
      
    req.abc=decodedToken;
    if (!decodedToken)
      return res.send({ status: false, message: "token is invalid" });

    next();
    }
    catch(error){
        res.status(500).send({status:false,message:error.message})
    }  
}
const mid2=async (req,res,next)=>{
  let bookId = req.params.bookId;
  if(!isValidObjectId(bookId))
  return res.status(400).send({status:false,message:"Please enter correct bookId"})
  let data= await bookModel.findById(bookId)
  if(req.abc.userId==data.userId)
  next();
  else
  return res.status(403).send({status:false,msg:"not authorized"})
}
module.exports.mid1=mid1
module.exports.mid2=mid2