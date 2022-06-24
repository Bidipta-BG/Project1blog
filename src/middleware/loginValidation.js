


const loginvalidation = async function (req, res , next) {
    try{

        let body = req.body
        if(!(("email" in body) && ("password" in body) )){
            return res.status(400).send({status: false, message: "All field is mandatory" })
        }
        if((body.email.length == 0) || (body.password.length == 0)){
            return res.status(400).send({status: false, msg:"This fields are required. Cannot be empty"})
        }
            
        next()
    }
    catch(err){
        res.status(500).send({msg:"Serverside Errors. Please try again later", error: err.message})
    }
    }


module.exports.loginvalidation = loginvalidation