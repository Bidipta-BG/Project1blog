const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")

const createBlog = async function (req, res) {
    try {
        let enteredAuthorId = req.body.authorId
        searchAuthId = await authorModel.findById(enteredAuthorId)
        if (!searchAuthId) {
            res.status(404).send({ msg: "Author is not registered. Please enter a valid authorId" })
        } else {
            let authorData = await blogModel.create(req.body)
            res.status(201).send({ status: true, data: authorData })
        }
    }
    catch (err) {
        res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })

    }
}

const getBlogs = async function (req, res) {
    try {
        // let data = req.query
        // data.isDeleted=false
        // data.isPublished = true
        let savedBlogs = await blogModel.find({ isDeleted: false, isPublished: true  })
        res.status(200).send({ status: true, data: savedBlogs })

        if (!savedBlogs) res.status(404).send({ status: false, msg: "No data exist" })
    }
    catch (err) {
        res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })

    }

    try {
        let data = req.query
        let savedBlogs = await blogModel.find(data).populate("authorFresh")
        res.status(200).send({ status: true, data: savedBlogs })
    }
    catch (err) {
        res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs

