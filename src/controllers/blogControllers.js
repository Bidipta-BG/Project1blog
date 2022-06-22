const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")

//----------------------------------------CREATE BLOGS-----------------------------------------------

const createBlog = async function (req, res) {
    try {
        let enteredAuthorId = req.body.authorId
        searchAuthId = await authorModel.findById(enteredAuthorId)
        if (!searchAuthId) {
            return res.status(404).send({ msg: "Author is not registered. Please enter a valid authorId" })
        } else {
            let body = req.body
            body.isPublished = true
            let authorData = await blogModel.create(body)
            return res.status(201).send({ status: true, data: authorData })
        }
    }
    catch (err) {
        return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })

    }
}



//--------------------------------------------GET BLOGS -----------------------------------------------------

const getBlogs = async function (req, res) {
    try {
        let data = req.query
        data.isDeleted = false
        data.isPublished = true
        let savedBlogs = await blogModel.find(data).populate("authorId")

        if (savedBlogs.length == 0) {
            return res.status(404).send({ status: false, msg: "No data exist" })
        } else {
            return res.status(200).send({ status: true, data: savedBlogs })
        }
    }
    catch (err) {
        return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })

    }

}

//---------------------------------------------PUT BLOGS ------------------------------------------------

const updateBlog = async function (req, res) {
    try{
    let enteredBlogId = req.params.blogId
    searchBlog = await blogModel.findById(enteredBlogId)
    console.log(searchBlog)
    if (!searchBlog){
        return res.status(404).send({status:false, msg: "Please enter a valid blog Id"})
    }if(searchBlog.isDeleted== true){
        return res.status(404).send({status:false, msg: "This blog has been deleted"})
    }
    if(searchBlog.isDeleted == false){
        let publishDate = moment().format('YYYY-MM-DD h:mm:ss')
        let updateData= await blogModel.findByIdAndUpdate(enteredBlogId, {title: req.body.title, body: req.body.body,
                             $addToSet: { tags: req.body.tags, subcategory: req.body.subcategory},isPublished: true, publishedAt: publishDate} ,{new: true}).populate("authorId")
        return res.status(200).send({status:true, data: updateData})
    }
    }catch(err){
        return res.status(500).send({msg:"Serverside Errors. Please try again later", error: err.message})

    }
}


//------------------------------------------DELETE BLOGS ------------------------------------------------------

const deleteBlogId = async function(req,res){

    try{
        const blogId =  req.params.blogId
        const validId= await blogModel.findById(blogId)
        if (!validId){
            return res.status(400).send({status:false,msg: "Blog Id is invalid"})
        }
        if(validId.isDeleted == true)  {
            return res.status(404).send({status:false, msg: "Blog Document doesnot exist. Already deleted"})
        }
        if(validId.isDeleted== false){
        let deleteDate = moment().format('YYYY-MM-DD h:mm:ss')
        console.log(deleteDate)
        await blogModel.findOneAndUpdate({_id : blogId},{isDeleted : true, deletedAt :deleteDate },
         {new : true})
         return res.status(201).send({status:true, msg: "Blog successfully deleted"})
        }

    }
    catch(err){
        console.log(err)
        return res.status(500).send({status:false, msg:err.message})
    }
}


//----------------------------------DELETE BY QUERY PARAM -----------------------------------------

const deleteBlogIdAndQuery = async function(req,res){

    try{
     
        let queries = req.query
        if(Object.keys(queries).length === 0){
            return res.status(400).send({status:false, msg:'Bad Request. Please enter valid condition'})
        }
        else{
        let updateData = await blogModel.updateMany(queries, {$set: {isDeleted : true}},{new: true}).populate("authorId")
        console.log(updateData)
        // if(updateData.matchedCount==0){
        //     return res.status(404).send({status:false, msg: "Blog Document doesnot exist. Already deleted"})
        // }else{
            return res.status(201).send({status:true,msg: "Blog successfully deleted", data: updateData})
        // }
    }

    }
    catch(err){
        console.log(err)
        return res.status(500).send({status:false, msg:err.message})
    }
}







module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.deleteBlogId = deleteBlogId
module.exports.updateBlog = updateBlog
module.exports.deleteBlogIdAndQuery = deleteBlogIdAndQuery

