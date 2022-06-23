const jwt = require("jsonwebtoken")


const authentication = async function (req, res, next) {

    try {
        //-------token check--------
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];

        //If no token is present in the request header return error
        if (!token) return res.status(400).send({ status: false, msg: "Token must be present" });
        console.log(token);



        next()
    }

    catch (err) {
        res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })
    }

}


module.exports.authentication = authentication

