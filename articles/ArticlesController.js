const express = require("express");
const routes = express("routes");
const Category = require("../categories/Category");
const Article  = require("../articles/Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");


//https://www.tiny.cloud/get-tiny/self-hosted/
//https://www.tiny.cloud/get-tiny/language-packages/

routes.get("/admin/articles",adminAuth, (req, res) =>{
   Article.findAll({
      include: [{model: Category}]
   }
   ).then( articles =>{
      res.render("admin/articles/index", {articles : articles});
   })
  
});

routes.get("/admin/articles/new", adminAuth, (req, res) =>{
   Category.findAll().then(categories => {
      res.render("admin/articles/new", {categories : categories});
   });
    
});
             
routes.post("/articles/save",adminAuth, (req, res) =>{
   var title = req.body.title;
   var body  = req.body.body;
   var category = req.body.category;

   Article.create({
      title : title,
      slug: slugify(title),
      body:body,
      categoryId: category
   }).then(()=>{
      res.redirect("/admin/articles")
   })

});

routes.post("/articles/delete",adminAuth, (req, res) =>{
   var id = req.body.id;
   
   if (id != undefined){
       if (!isNaN(id)){
           Article.destroy({
               where: {
                   id:id
               }
           }).then(() =>{
               res.redirect("/admin/articles");    
           });
       }else{//NÃO FOR NÚMERO
           res.redirect("/admin/articles");
       }
   }else{ //NULL
       res.redirect("/admin/articles");
   }
});

routes.get("/admin/articles/edit/:id",adminAuth, (req, res) => {
   var id = req.params.id;
   Article.findByPk (id).then( article => {
      if (article != undefined){
         Category.findAll().then(categories =>{
            res.render("admin/articles/edit", {article: article, categories: categories})
         })
         
      }else{
         res.redirect("/");   
      }
   }).catch (err => {
      res.redirect("/");
   });
});

routes.post("/articles/update",adminAuth, (req, res) =>{
   var id       = req.body.id;
   var title    = req.body.title;
   var body     = req.body.body;
   var category = req.body.category;

   Article.update({
      title : title,
      body: body,
      categoryId: category, slug: slugify(title)},
         {
            where:{
               id :id
            }
         }
      ).then(() =>{
         res.redirect("/admin/articles");
      }).catch( err =>{
         res.redirect("/");
      });

});


routes.get("/articles/page/:num", (req, res) =>{
   var page = req.params.num;
   var offset = 0;
   var limit = 2;

   if (isNaN(page) || page == 1){
      offset = 0;
   }else{
      offset = (parseInt(page) - 1) * limit;
   }  
    

   Article.findAndCountAll({
      limit:limit,
      offset: offset,
      order:[
            ['id', 'DESC']         
         ]
   }).then( articles =>{

      var next;
      if (offset + limit >= articles.count){
         next = false;
      }else{
         next = true;
      }

      var result = {
         page: parseInt(page),
         next : next,   
         articles : articles
      }

      Category.findAll().then( categories =>{
         res.render("admin/articles/page", {result : result, categories:categories})
      });

     // res.json(resul);
   });
});

module.exports = routes;