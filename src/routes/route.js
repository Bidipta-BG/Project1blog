const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogControllers")
const authorValidator= require("../middleware/authorvalidation")
const blogValidator= require("../middleware/blogvalidation")
const login = require("../controllers/loginController")
const loginvalidation = require("../middleware/loginvalidation")
const authentication = require("../middleware/authentication")




router.post("/createAuthor",authorValidator.authorValidator ,authorController.createAuthor)

router.post("/createblog",blogValidator.blogValidator,  blogController.createBlog)

router.get("/blogs", blogController.getBlogs)

router.put("/blogs/:blogId",blogController.updateBlog)

router.delete("/blogs/:blogId", blogController.deleteBlogId)

router.delete("/blogs", blogController.deleteBlogIdAndQuery)


//---------------Login---------

router.post("/loginUser" ,loginvalidation.loginvalidation ,  login.loginUser )


module.exports = router;