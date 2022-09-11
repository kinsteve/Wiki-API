const express= require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
const ejs= require("ejs");

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDb");

const articleSchema=new mongoose.Schema({
    title:{
        type:String,
        required: [true,"Please check your data entry, no title specified "]
    },
    content:{
        type:String
    }
});

const Article=mongoose.model("Article",articleSchema);

/////////////////////////////////////Request targeting all articles//////////////////////

app.route("/articles")           //this is a chaining route used when we use the same path 
  .get(function(req,res){
    Article.find(function(err,foundArticles){
        //  console.log(foundArticles);
        if(!err)
         res.send(foundArticles);
         else
          res.send(err);   
        });
  })
 
   .post(function(req,res){
    // console.log();
    // console.log(req.body.content);
    const newArticle= new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if(!err)
        {  res.send("Successfully added a new article");
        }else
           res.send(err);
    });
   })

   .delete((req,res)=>{
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles");
        }
        else{
            res.send(err);
        }
    });
  });

/////////////////////////////////////Request targeting A specific article//////////////////////

app.route("/articles/:articleTitle")    //note: to access an article that has space in its title we use %20 in place of space.

.get((req,res)=>{
    
  Article.findOne(
    {title:req.params.articleTitle},
    (err,foundArticle)=>{
        if(foundArticle)
          res.send(foundArticle);
        else
          res.send("No such article found!!");
    }
  )
})

.put((req,res)=>{ 
    Article.updateOne(   //The updateOne() function is used to update the first document that matches the condition. This function is the same as update(), except it does not support the multi or overwrite options
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        (err)=>{
            if(!err)
              res.send("Successfully updated article.");
            else
              res.send(err);        
            }
    );
})

.patch((req,res)=>{
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set:req.body},
        (err)=>{
            if(!err)
              res.send("Successfully updated the article");
            else
              res.send(err); 
        }
    )
})

.delete((req,res)=>{
    Article.deleteOne(
        {title:req.params.articleTitle},
        (err)=>{
            if(!err)
              res.send("Article Successfully the corresponding deleted.");
              else
              res.send(err);
        }
    );
});







app.listen(3000,function(){
  console.log("Server started at port 3000");
});