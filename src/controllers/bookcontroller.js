const userModel = require("../Models/userModel")
const bookModel= require ("../Models/bookModel")
const { isValidObjectId } = require('mongoose');

const createBook = async function (req, res) {
    try {
        let { title, excerpt, userId, ISBN, category, subcategory} = req.body
        if(!req.body){
            return res.status(400).send({status:false,message:"body is blank"})
        }
        let checktitle = await bookModel.findOne({title:title})
        // this is tittle validation
        if (!title) {
            return res.status(400).send({ status: false, message:"tittle is require" })
        }
        if(checktitle){
          return res.status(400).send({ status: false, message:"Please provide unqiue tittle" })
        }
        

        // this is user validation
        if (!userId) {
            return res.status(400).send({ status: false, message:"userId is require" })
        }
        if(!isValidObjectId(userId)){
          return res.status(400).send({ status: false, message:"userId is not vaild" })
        }
          let data1 = await userModel.findById({_id:userId})
          
          if(!data1){
            return res.status(404).send({ status: false, message:"userId is not register" })
          }
  

        if (!excerpt) {
            return res.status(400).send({ status: false, message:"excerpt is require"})
        }

        // ISBN
        let testbook = await  (await bookModel.find().select({ISBN:1,_id:0})).map(x=>x.ISBN);
        if (!ISBN) {
            return res.status(400).send({ status: false, message:"ISBN is require"})
        }
        if(testbook.includes(ISBN))
        {
          return res.status(400).send({ status: false, message:"Please provide unique ISBN" })
        }
        if (!category) {
            return res.status(400).send({ status: false, message:"category is require"})
        }
        if (!subcategory) {
            return res.status(400).send({ status: false, message:"subcategory is require"})
        }
        req.body.releasedAt= new Date();
         let bodydata= req.body
       let data = await bookModel.create(bodydata);
       return res.status(201).send({status:true,data:data});
        
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}


module.exports.createBook = createBook
//Get All Books
const getAllBooks = async function (req, res) {
    try {
        let field = req.query;
       let getFilter = Object.keys(field)
        if (getFilter.length) {
            for (let value of getFilter) {
                if (['category', 'userId', 'subcategory'].indexOf(value) == -1)
                    return res.status(400).send({ status: false, message: `You can't filter Using '${value}' ` })
            }
        }
      const { userId, category, subcategory } = field //destructure
  
      //check userId
        
        //check the userId is valid
          if (!userId){
            return res.status(400).send({ status: false, message: "UserId should  be present" })
            }
          if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "UserId is not valid" })
          }
        
    
        //check the category value is present
      
      if (category !== undefined) {
          return res.status(400).send({ status: false, message: "category should  be present" })
          }
  
        //check the subcategory value is present
     
      if (subcategory !== undefined) {
          return res.status(400).send({ status: false, message: "subcategory should  be present" })
          
      }
  
      let filter = {
        ...field,
        isDeleted: false
      };
     
      // get these field from bookModel book _id, title, excerpt, userId, category, releasedAt, reviews 
      const Getbooks = await bookModel.find(filter)
        .select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 });
  
      if (Getbooks.length == 0)
        return res.status(404).send({ status: false, message: "No Book is found" });
  
        //sort alphabetically
      Getbooks.sort(function (a, b) {
        const nameA = a.title;
        const nameB = b.title;
        if (nameA < nameB) { return -1; }
        if (nameA > nameB) { return 1; }
        return 0;
      });
  
      return res.status(200).send({ status: true, message: 'Books list', data: Getbooks })
  
    }
    catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };

  module.exports.getAllBooks = getAllBooks;