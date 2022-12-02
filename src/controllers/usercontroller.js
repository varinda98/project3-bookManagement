const userModel=require('../Models/userModel')
const jwt = require("jsonwebtoken");
const validator= require("../regex");


const userRegister = async function (req, res) {

try {
        let data = req.body
        let { title, name, phone, email, password, address } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter data to register user" })

        //check title

        if (!validator.isValid(title) || title != 'Mr' && title != 'Mrs' && title != 'Miss') {
            return res.status(400).send({ status: false, msg: "please provide title in Mr, Mrs, Miss" })
        }
        //check name
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "please provide name in proper format" })
        }
        if (!validator.regexName(name)) {
            return res.status(400).send({ status: false, msg: "please provide name in character only" })
        }
        //phone
        if (!validator.isValidnum(phone)) {
            return res.status(400).send({ status: false, msg: "please provide phone in proper format" })
        }
        if (!validator.regexPhone(phone)) {
            return res.status(400).send({ status: false, msg: "please provide valid phone number" })
        }
        const duplicatephone = await userModel.findOne({phone})
        if (duplicatephone) {
            return res.status(409).send({ status: false, msg: "phone number is already registered" })
        }
        //valid email
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, msg: "please provide email in proper format" })
        }
        if (!validator.regexemail(email)) {
            return res.status(400).send({ status: false, msg: "please provide valid email" })
        }
        const duplicateEmail = await userModel.findOne({email:email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg: "email is already registered" })
        }
        //valid password
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, msg: "please provide password in proper format" })
        }
        if (!validator.regexPassword(password)) {
            return res.status(400).send({ status: false, msg: "Please provide password length 8 to 15 using symbol" })
        }
        //valid address
        if (address) {
            if (!validator.checkObject(address)) {
                return res.status(400).send({ status: false, msg: "please provide address" })
            }
            // if (Object.keys(address).length === 0) {
            //     return res.status(400).send({ status: false, msg: " please provide somthing in address" })
            // }
            if (!validator.isValid(address.street || address.city || address.pincode)) {
                return res.status(400).send({ status: false, msg: "please provide address in proper format" })
            }
            if (!validator.regexName(address.street)) {
                return res.status(400).send({ status: false, msg: "please provide valid street" })
            }
            if (!validator.regexName(address.city)) {
                return res.status(400).send({ status: false, msg: "please provide valid city" })
            }
            if (!validator.regexPincode(address.pincode)) {
                return res.status(400).send({ status: false, msg: "please provide valid pincode" })
            }
        }
        
    
        let userData = await userModel.create(data)
        return res.status(201).send({ status: true, msg: "User created successfully", data: userData })

    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



const userlogin= async (req,res)=>{
    try{
    if(!req.body){
        return res.status(400).send({status:false,message:"Body is empty,Please enter the value"})    
    }
  const {email,password}=req.body;
  if(!email){
    return res.status(400).send({status:false,message:"Please enter the email"})
   }
    if(!validator.regexemail(email)){
        return res.status(400).send({status:false,message:"email not valid"})
}

if(!validator.regexPassword(password)){
    return res.status(400).send({status:false,message:"Please enter vaild Password"})
} 
  let data= await userModel.findOne({email:email,password:password,isDeleted:false});

  if(!data){
    return res.status(404).send({status:false,message:"email and password not register"})
  }

  let token = jwt.sign(
    {
      userId: data._id.toString(),
      organisation: "Bookstore"
    },
    "Alone-But-Happy",
    {
        expiresIn: "2h"
    }
  );
 
  res.setHeader("x-api-key", token);
 return res.status(201).send({ status: true, token: token });
} catch(err){
    return res.status(500).send({status:false,message:err.message})
}
};


module.exports.userRegister=userRegister;
module.exports.userlogin=userlogin;