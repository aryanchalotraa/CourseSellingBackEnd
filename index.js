const express = require("express");
const app = express();
const {userRouter}=require("./router/user");
const {courseRoute}=require("./router/course");
const {adminRouter}= require("./router/admin");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());


app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/course",courseRoute);

async function main(){
await mongoose.connect(process.env.db_mongoose);
app.listen(3000);
}
main();