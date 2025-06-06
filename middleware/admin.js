const JWT = require("jsonwebtoken");
const{JWT_admin_SECRET}= require("../config");
function adminauth(req,res,next){
  const token = req.headers.token;
  const verifyEd = JWT.verify(token,JWT_admin_SECRET);
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
  adminauth
}