const { json } = require("express")
const userSchema = require("../schema/userschema")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const userschema = require("../schema/userschema")


async function register(req,res){

    const{fullname,username,email,number,password,role} = req.body

    const userExits = await userSchema.findOne({
        $or:[{username},{email}]
    })

    if(userExits){
        return res.status(400).json({
            message:"user already exits with this details"
        })
    }

    const updatedpassword = crypto.createHash("md5").update(password).digest("hex")

    const user = await userSchema.create({
        username,
        fullname,
        email,
        number,
        password:updatedpassword,
        role
        
    })

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

    res.cookie("token" ,token)

    res.status(201).json({
        messageL:"user register sucessfully",
        user:{
            fullname:fullname,
            username:username,
            email:email,
            role:role
            
        }
    })

}

async function Login(req,res){

  const {username,email,password} = req.body

  const user = await userschema.findOne({

    $or:[{email},{username}]

    })

    if(!user){
        return res.status(400).json({
            message:"user not found with this details"
        })
    }

    const notupdatedpassword = crypto.createHash("md5").update(password).digest("hex")

    
    const comparepassword = notupdatedpassword === user.password


    if(!comparepassword){
        return res.status(400).json({
            message:"incorrect password"
        })
    }

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

    res.cookie("token" , token)

    res.status(201).json({
        message:"user logined sucessfully",
        user
    })

  

}

async function getme(req,res){

    const {id} = req.user

  

   const user = await userSchema.findById(id)

    res.status(200).json({
        message:"user fetched sucessfully",
        user
    })

}

async function googleouth(req,res){

     const googleUser = req.user

    const email = googleUser.emails[0].value
    const fullname = googleUser.displayName

    // Check whether user already exists
    let user = await userSchema.findOne({ email })

    // If user doesn't exist, create a new buyer
    if (!user) {

        user = await userSchema.create({
            fullname: fullname,
            username: email.split("@")[0],
            email: email,
            role: "buyer"
        })
    }

    // Create Snitch JWT
    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET
    )

    // Store JWT in cookie
    res.cookie("token", token)

    // Redirect to frontend
    res.redirect("http://localhost:5173/")
}



module.exports ={
    register,
    Login,
    getme,
    googleouth
}