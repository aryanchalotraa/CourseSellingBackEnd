const{Router}=require("express");
const userRouter = Router();
const {userModel}=require("../db");
const {z}= require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {userauth}= require("../middleware/user")
const {JWT_SECRET}=require("../config");
userRouter.post("/signup",async function(req,res){
  try{  const requiredbody = z.object({
    email:z.string().min(3).max(30).email(),
    password:z.string().min(2).max(20),
    firstname:z.string().min(5).max(10),
    lastname:z.string().min(4).max(10)
  })
  const paresedBody =  requiredbody.parse(req.body);
  if(!paresedBody){
    res.json({
      massege:"not valid input"
    })
    
    return
  }
  const {email,password,firstname,lastname}= req.body;
  const hashedpassword= await bcrypt.hash(password,5);
  
  await userModel.create({
    email:email,
    password:hashedpassword,
    firstname:firstname,
    lastname:lastname
  })
  res.json({
    massage:"you are signuped"
  })}
  catch(err){
    console.error(err);
  }
})
userRouter.post("/signin",async function(req,res){
  try{const{email,password}= req.body;
  
  const user = await userModel.findOne({
    email:email
  })  
  console.log(user);
  const verifiedPass =  await bcrypt.compare(password,user.password);
  if (verifiedPass){
   const token =jwt.sign({
      id:user._id
    },JWT_SECRET);
    res.json({
      token:token
    })

  }else{
    res.json({
      messgae:"cant signin"
    })
  }
}catch(err){
    console.error(err);
    res.status(403).json({
      message:"incorrect credential"
    })
  }
  
})
userRouter.get("/purchases",userauth, async function(req,res){
  const userId= req.userId;
  const purchases = await purchaseModel.find({
    userId
  })
  const coursesData = await courseModel.find({
    _id:{$in: purchases.map(x=>x.courseId)}
  })
  res.json({
    coursesData
  })
})
module.exports ={
  userRouter:userRouter
}
