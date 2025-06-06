const {Router}=require("express");
const courseRoute =Router();
const {userauth}= require("../middleware/user");
const {purchaseModel}= require("../db")
courseRoute.post("/purchases",userauth,async function(req,res){
  const userId = req.userId;
  const courseId = req.body.courseId;

  //add should check if actually paid the price
  await purchaseModel.create({
    userId,
    courseId

  })
  res.json({
    message:"you are good to go"
  })
})
courseRoute.get("/preview",async function(req,res){
  const course = await courseModel.find({});
 res.json({
  message:"you are good to go",
  course
 })
})

module.exports ={
  courseRoute:courseRoute
}