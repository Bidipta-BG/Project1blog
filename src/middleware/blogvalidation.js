const authorModel = require("../models/authorModel")
const ObjectId = require('mongoose').Types.ObjectId



const blogValidator = async function (req, res, next) {

    try{
        let body = req.body
        let authorId = body.authorId
        let enteredAuthorId = body.authorId
        if(!(("title" in body) && ("body" in body) && ("category" in body) && ("authorId" in body))){
            return res.status(400).send({status: false, message: "All field is mandatory" })
        }
        if((body.title.length == 0) || (body.body.length == 0)|| (body.category.length == 0)|| (body.authorId.length == 0)){
            return res.status(400).send("This fields are required. Cannot be empty")
        }
        if(!ObjectId.isValid(authorId)){
             return res.status(400).send({ status: false, msg: "AuthorId invalid" })
        } 
        searchAuthId = await authorModel.findById(enteredAuthorId)
        if (!searchAuthId){
            return res.status(404).send({msg: "AuthorId not found"})
        }
        next()
        } 
    catch(err){
        res.status(500).send({msg:"Serverside Errors. Please try again later", error: err.message})

    }
}



module.exports.blogValidator = blogValidator