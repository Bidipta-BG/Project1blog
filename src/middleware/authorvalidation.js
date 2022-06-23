const authorModel = require("../models/authorModel")


const authorValidator = async function (req, res, next) {

    try{
    let data = req.body
    if(!(("fname" in data) && ("lname" in data) && ("title" in data) && ("email" in data) &&("password" in data))){
        return res.status(400).send({status: false, message: "All field is mandatory" })
    }
    if((data.fname.length == 0) || (data.lname.length == 0)){
        return res.status(400).send({status: false, msg:"This fields are required. Cannot be empty"})
    }
    if((data.title !== "Mr")&&(data.title !== "Mrs")&&(data.title !== "Miss")){
        return res.status(400).send({ status: false, message: "Bad Request. Title must only have 'Mr','Mrs' or 'Miss'" })
        }
    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email))) {
        return res.status(400).send({ status: false, message: "Email should be a valid email address" })
        }
    if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).test(data.password)){
        return res.status(400).send({ status: false, message: "Password should be a combination of at least one lowercase letter, one uppercase letter, one numeric digit, and one special character" })
        }
    let dbData= await authorModel.find({email: data.email})
    if(dbData.length!=0){
        return res.status(400).send({status: false, msg: "Bad Request. This email already exist. Please enter another email"})
    }   
    next()
    } catch(err){
        res.status(500).send({msg:"Serverside Errors. Please try again later", error: err.message})

    }
}



module.exports.authorValidator = authorValidator