const {Router}= require("express");
const adminRouter = Router();
const{adminModel}=require("../db");
const {z}= require("zod");
const { JWT_admin_SECRET }= require("../config");
const {adminauth}= require("../middleware/admin");
const jwt = require("jsonwebtoken");
const bcrypt= require("bcrypt");

adminRouter.post("/signup",async function(req,res){
  try{  const requiredbody = z.object({
    email:z.string().min(3).max(300).email(),
    password:z.string().min(2).max(200),
    firstname:z.string().min(5).max(100),
    lastname:z.string().min(4).max(100)
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
  
  await adminModel.create({
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
adminRouter.post("/signin",async function(req,res){
 try{ const{email,password}= req.body;
  const admin = await adminModel.findOne({email});
  const verifiedPass = await bcrypt.compare(password,admin.password);
  
  if (verifiedPass){
   const token =jwt.sign({
      id:admin._id
    },JWT_admin_SECRET);
    res.json({
      token:token
    })

  }
}catch(err)  {
    res.status(403).json({
      message:err
    })
  }
  
})
adminRouter.post("/course",adminauth,async function(req,res){
  const adminId  = req.userid;
  const{title,description,price,imageUrl}=  req.body;
  const course  = await courseModel.create({
    title,
    description,
    price,
    imageUrl,
    createrId:adminId

  })
  res.json({
    messgae:"course update",
    courseId:course._id
  })
})
adminRouter.put("/course",adminauth,async function(req,res){
  const adminId  = req.userid;
  const{title,description,price,imageUrl,courseId}=  req.body;
  const course  = await courseModel.updateOne({
    _id:courseId,
    creatorId:adminId

  },{
    title,
    description,
    price,
    imageUrl,
    createrId:adminId

  })
  res.json({
    messgae:"course updated",
    courseId:course._id
  })
})
adminRouter.get("/course/bulk",adminauth,async function(req,res){
  const adminId=  req.userid;
  const course = await courseModel.find({
    creatorId:adminId
  });
  res.json({
    messgae:"courseupdates",
    courseId:course._id
  })
  
})
module.exports={
  adminRouter:adminRouter
}