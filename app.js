require("dotenv").config();

 const express=require("express");
 const path =require("path");
 const mongoose=require("mongoose");
const userRoute=require('./routes/user');
const blogRoute=require("./routes/blog");
const cookieParser=require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog=require('./models/blog');

 const app=express();
 const PORT=process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI).then((e) => console.log("mongodb connected"));
 app.set("view engine","ejs");
 app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

 app.get("/",async(req,res)=>{
  const allBlogs=await Blog.find({});
   res.render("home",{
      user:req.user,
      blogs:allBlogs,
   });
 });

app.use("/blog",blogRoute);
app.use("/user",userRoute);

 app.listen(PORT,() => console.log(`server started at port:${PORT}`));