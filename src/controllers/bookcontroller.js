const userModel = require("../Models/userModel");
const bookModel= require ("../Models/bookModel");
const moment = require('moment');
const { isValidObjectId } = require('mongoose');
const validator= require("../regex");
const reviewModel = require("../Models/reviewModel");

const createBook = async function (req, res) {
    try {
        let { title, excerpt, userId, ISBN, category, subcategory} = req.body
        if(!req.body){
            return res.status(400).send({status:false,message:"body is blank"})
        }
        let checktitle = await bookModel.findOne({title:title})
        // this is tittle validation
        if (!title) {
            return res.status(400).send({ status: false, message:"title is require" })
        }
        if(checktitle){
          return res.status(400).send({ status: false, message:"Please provide unqiue title" })
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
        let testbook = await bookModel.findOne({ISBN:ISBN});
        if (!ISBN) {
            return res.status(400).send({ status: false, message:"ISBN is require"})
        }
        if(!validator.ValidateSBIN(ISBN)){
          return res.status(400).send({ status: false, message:"ISBN is require"}) 
        }
        if(testbook)
        {
          return res.status(400).send({ status: false, message:"Already registered ISBN" })
        }
        if (!category) {
            return res.status(400).send({ status: false, message:"category is require"})
        }
        if (!subcategory) {
            return res.status(400).send({ status: false, message:"subcategory is require"})
        }
        if (!releasedAt) {
          return res.status(400).send({ status: false, message:"subcategory is require"})
      }
      if (!validator.validateDate(releasedAt)) {
        return res.status(400).send({ status: false, message:"subcategory is require"})
    }
         let bodydata= req.body
       let data = await bookModel.create(bodydata);
       return res.status(201).send({status:true,data:data});
        
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}



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


  const deleteBookBYId = async function (req, res) {

    try { 
      let bookId = req.params.bookId
  
      if (!isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "Invalid BookId" });
      }
  
      let checkBook = await bookModel.findOne({ _id:bookId, isDeleted: false })
  
      if (!checkBook) {
        return res.status(404).send({ status: false, message: 'book not found or already deleted' })
      }
  
      let updateBook = await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt:moment().format("YYYY-MM-DD") }, { new: true })
  
      res.status(200).send({ status: true, message: 'sucessfully deleted' })
  
    } catch (error) {
      res.status(500).send({ status: false, error: error.message });
    }
  }

  const updateBook = async function (req, res) {
    try {
      let BookId = req.params.bookId
  
      // check bookId is valid
      if (!BookId) return res.status(400).send({ status: false, message: "Please enter bookId." });
      if (!isValidObjectId(BookId)) {
        return res.status(400).send({ status: false, message: "Please Enter correct Book Id" })
      }
      //check book is exist or not
      const bookIdExist = await bookModel.findOne({ _id: BookId,isDeleted:false})
      if (!bookIdExist) return res.status(404).send({ status: false, message: "Book Not Found" })
      //if (bookIdExist.isDeleted == true) return res.status(404).send({ status: false, message: "Book Not Found" })
  
      //provide data in req.body
      let data = req.body
      let { title, excerpt, releasedAt, ISBN } = data
      if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter Data to update document" })
  
      //check title
  
      if (title) {
        if (!validator.isValid(title))
          return res.status(400).send({ status: false, msg: "please provide title in proper format" })
      }
      let checkTitle = await bookModel.findOne({ title })
      if (checkTitle) return res.status(400).send({ status: false, message: "book with same title is already present...!" })
  
      // check excerpt
      if (excerpt) {
        if (!validator.isValid(excerpt))
          return res.status(400).send({ status: false, message: "please provide a excerpt" })
      }
      //Check releasedAt
  
      if (!validator.validateDate(releasedAt)) {
        return res.status(400).send({ status: false, message: "please provide  date in proper format" })
  
      }
  
        // check ISBN
  
        if (ISBN) {
          if (!regex.test(ISBN)) return res.status(400).send({ status: false, msg: "please provide Valid ISBN" })
  
          let checkISBN = await bookModel.findOne({ ISBN })
          if (checkISBN) return res.status(400).send({ status: false, message: "book with same ISBN is already present...!" })
        }
  
        // update
        let update = await bookModel.findOneAndUpdate({ _id: BookId, isDeleted: false }, { $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN } }, { new: true })
  
        return res.status(200).send({ status: true, message: "Update Book Successfully", data: update })
      }
    
    catch (err) {
      return res.status(500).send({ status: false, message: err.message });
  
    }
  
  }
  

  const getBookById = async function (req, res) {
    try{
    let bookId = req.params.bookId;
  // bookid validation
  if (!bookId) {
    return res.status(400).send({ status: false, message:"Please provide bookid" })
      }
if (!isValidObjectId(bookId)) {
  return res.status(400).send({ status: false, message: "Invalid BookId" });
}
    let bookDetails = await bookModel.findOne({_id:bookId,isDeleted:false}).lean();
       if (!bookDetails){
       res.status(404).send({ status: false, msg: "No such user exists" });
       }
       let review = await reviewModel.find({bookId:bookId,isDeleted:false})
      let data=
        bookDetails; //.toJSON(); ,_doc etc.
      data.reviewsData=review;
      
     res.status(200).send({ status: true,message:"Books list", data:data });
    }
    catch(err){
      return res.status(500).send({status:false,message:err.message})
    }
  };

  module.exports.getAllBooks = getAllBooks;
  module.exports.deleteBookBYId=deleteBookBYId;
  module.exports.createBook = createBook;
  module.exports.updateBook=updateBook;
  module.exports.getBookById=getBookById;
  