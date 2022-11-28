// const userModel = require("../Models/userModel")
// const ObjectId = mongoose.schema.Types.ObjectId


const bookModel = require('../Models/bookModel')

const createBook = async function (req, res) {
    try {
        let bodydata = req.body
        if(!req.body){
            return res.status(400).send({status:false,message:"body is blank"})
        }
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body
        if (!title) {
            return res.status(400).send({ status: false, message:"tittle is require" })
        }
        if (!userId) {
            return res.status(400).send({ status: false, message:"userId is require" })
        }
        if (!excerpt) {
            return res.status(400).send({ status: false, message:"excerpt is require"})
        }
        if (!ISBN) {
            return res.status(400).send({ status: false, message:"ISBN is require"})
        }
        if (!category) {
            return res.status(400).send({ status: false, message:"category is require"})
        }
        if (!subcategory) {
            return res.status(400).send({ status: false, message:"subcategory is require"})
        }
        // if (!releasedAt) {
        //     return res.status(400).send({ status: false, message:"releasedAt is require"})
        // }
        if(releasedAt){
            releasedAt=new Date(YYYY-MM-DD);
        }
        
        let titleExist = await bookModel.findOne({title:title})

        if(titleExist) { return res.status(400).send({status:false, message:" title should be unique"})}

        let checkUnique = await bookModel.findById(ISBN)
        if (checkUnique) {
            return res.status(404).send({ status: false, msg: 'please enter unique ISBN number' })
        }

            let bookData = await bookModel.create(bodydata)
            res.status(201).send({ status: true, data: bookData })
        
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
          if (!mongoose.Types.ObjectId.isValid(userId)) {
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