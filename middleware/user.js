const JWT = require("jsonwebtoken");
const{JWT_SECRET}= require("../config");
function userauth(req,res,next){
  const token = req.headers.token;
  const verifyEd = JWT.verify(token,JWT_SECRET);
  if(verifyEd){
    req.userid= verifyEd.id ;
    next();
  }else{
    res.json({
      message:"not valid cred"
    })
  }
}
module.exports={
  userauth
}