const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogControllers")


router.post("/createAuthor", authorController.createAuthor)

router.post("/createblog", blogController.createBlog)

router.get("/getBlogs" , blogController.getBlogs)

router.put("/blogs/:blogId", blogController.updateBlog)

router.delete("/blogs/:blogId", blogController.deleteBlogId)

router.delete("/blogs", blogController.deleteBlogIdAndQuery)






module.exports = router;