const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const moment = require('moment')
const ObjectId = require('mongoose').Types.ObjectId
const jwt = require("jsonwebtoken")



const createBlog = async function (req, res) {
    try {
        //     //-------token check--------
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];

        //If no token is present in the request header return error
        if (!token) return res.status(400).send({ status: false, msg: "Token must be present" });
        console.log(token);

        //>>>>>>>>>>>>>>>>Authentication

        let decodedToken = jwt.verify(token, "bidipta-jiyalal-unmesh");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "Token is invalid" });

        //---------------Authorisation

        let userToBeModified = req.body.authorId
        //userId for the logged-in user
        let userLoggedIn = decodedToken.userId

        //userId comparision to check if the logged-in user is requesting for their own data
        if (userToBeModified != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })

        //>>>>>>>>>>>>>>>>

        let body = req.body
        body.isPublished = true
        let authorData = await blogModel.create(body)
        return res.status(201).send({ status: true, data: authorData })
    }
    catch (err) {
        return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })

    }
}






const getBlogs = async function (req, res) {
    try {
        //     //-------token check--------
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];

        //If no token is present in the request header return error
        if (!token) return res.status(400).send({ status: false, msg: "Token must be present" });
        console.log(token);

        //>>>>>>>>>>>>>>>>Authentication

        let decodedToken = jwt.verify(token, "bidipta-jiyalal-unmesh");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "Token is invalid" });

        //---------------Authorisation

        // let userToBeModified = req.body.authorId
        // //userId for the logged-in user
        // let userLoggedIn = decodedToken.userId

        // //userId comparision to check if the logged-in user is requesting for their own data
        // if (userToBeModified != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })

        //-------------Code    
        let data = req.query
        let authorId = data.authorId
        if (("authorId" in data) && (!ObjectId.isValid(authorId))) {
            return res.status(400).send({ status: false, msg: "AuthorId invalid" })
        }
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







const updateBlog = async function (req, res) {
    try {
        let body = req.body
        console.log(typeof(body.title))
        if((body.title.length == 0) || (body.body.length == 0)|| (body.category.length == 0)|| (body.authorId.length == 0)){
            return res.status(400).send("This fields are required. Cannot be empty")
        }
        //     //-------token check--------
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];

        //If no token is present in the request header return error
        if (!token) return res.status(400).send({ status: false, msg: "Token must be present" });
        console.log(token);

        //>>>>>>>>>>>>>>>>Authentication

        let decodedToken = jwt.verify(token, "bidipta-jiyalal-unmesh");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "Token is invalid" });

        //---------------Authorisation

        // let userToBeModified = req.body.authorId
        //userId for the logged-in user
        // let userLoggedIn = decodedToken.userId

        // //userId comparision to check if the logged-in user is requesting for their own data
        // if (userToBeModified != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })





        let enteredBlogId = req.params.blogId
        if (!ObjectId.isValid(enteredBlogId)) {
            return res.status(400).send({ status: false, msg: "BlogId invalid" })
        }
        let searchBlog = await blogModel.findById(enteredBlogId)
        console.log(searchBlog)

        let userToBeModified = searchBlog.authorId
        let userLoggedIn = decodedToken.userId

        //userId comparision to check if the logged-in user is requesting for their own data
        if (userToBeModified != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })

        if (!searchBlog) {
            return res.status(404).send({ status: false, msg: "Blog not found" })
        } if (searchBlog.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "This blog has been deleted" })
        }
        if (searchBlog.isDeleted == false) {
            let publishDate = moment().format('YYYY-MM-DD h:mm:ss')
            let updateData = await blogModel.findByIdAndUpdate(enteredBlogId, {
                title: req.body.title, body: req.body.body,
                $addToSet: { tags: req.body.tags, subcategory: req.body.subcategory }, isPublished: true, publishedAt: publishDate
            }, { new: true }).populate("authorId")
            return res.status(200).send({ status: true, data: updateData })
        }
    } catch (err) {
        return res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })

    }
}







const deleteBlogId = async function (req, res) {

    try {
        //     //-------token check--------
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];

        //If no token is present in the request header return error
        if (!token) return res.status(400).send({ status: false, msg: "Token must be present" });
        console.log(token);

        //>>>>>>>>>>>>>>>>Authentication

        let decodedToken = jwt.verify(token, "bidipta-jiyalal-unmesh");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "Token is invalid" });

        //---------------Authorisation

        // let userToBeModified = req.body.authorId
        //userId for the logged-in user
        // let userLoggedIn = decodedToken.userId

        // //userId comparision to check if the logged-in user is requesting for their own data
        // if (userToBeModified != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })    



        let enteredBlogId = req.params.blogId
        if (!ObjectId.isValid(enteredBlogId)) {
            return res.status(400).send({ status: false, msg: "BlogId invalid" })
        }
        const validId = await blogModel.findById(enteredBlogId)
        if (!validId) {  //check if document is present in DB
            return res.status(400).send({ status: false, msg: "Blog Id is invalid" })
        }
        console.log(validId)

        let userToBeModified = validId.authorId
        let userLoggedIn = decodedToken.userId 

        //userId comparision to check if the logged-in user is requesting for their own data
        if (userToBeModified != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })    


        if (validId.isDeleted == true) {  //check if the document is already deleted
            return res.status(404).send({ status: false, msg: "Blog Document doesnot exist. Already deleted" })
        }
        if (validId.isDeleted == false) {  //if item is not deleted or is present in DB
            let deleteDate = moment().format('YYYY-MM-DD h:mm:ss')
            await blogModel.findOneAndUpdate({ _id: enteredBlogId }, { isDeleted: true, deletedAt: deleteDate },
                { new: true })
            return res.status(201).send({ status: true, msg: "Blog successfully deleted" })
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message })
    }
}





const deleteBlogIdAndQuery = async function (req, res) {

    try {
        //     //-------token check--------
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];

        //If no token is present in the request header return error
        if (!token) return res.status(400).send({ status: false, msg: "Token must be present" });
        console.log(token);

        //>>>>>>>>>>>>>>>>Authentication

        let decodedToken = jwt.verify(token, "bidipta-jiyalal-unmesh");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "Token is invalid" });



        let data = req.query
        let authorId = data.authorId
        // let userToBeModified = validId.authorId
        let userLoggedIn = decodedToken.userId 

        let abc = await blogModel.find(data).populate("authorId")
        console.log(abc)


        //userId comparision to check if the logged-in user is requesting for their own data
        if (authorId != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })  

        if (("authorId" in data) && (!ObjectId.isValid(authorId))) {
            return res.status(400).send({ status: false, msg: "AuthorId invalid" })
        }
        if (Object.keys(data).length === 0) {   //checking if entered filter is empty. If empty
            return res.status(400).send({ status: false, msg: 'Bad Request. Please enter valid condition' })
        }
        else {
            let updateData = await blogModel.updateMany(data, { $set: { isDeleted: true } })
            // console.log(updateData)
            if (updateData.matchedCount == 0) {  //if combination of filtered documents doesnot exist
                return res.status(404).send({ status: false, msg: "Blog Document doesnot exist for this filter" })
            } else {
                return res.status(201).send({ status: true, msg: "Blog successfully deleted", data: updateData })
            }
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message })
    }
}




module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlogId = deleteBlogId
module.exports.deleteBlogIdAndQuery = deleteBlogIdAndQuery