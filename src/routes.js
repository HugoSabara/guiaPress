const express = require("express");
const routes = express("routes");
const Article = require("../articles/Article");
const Category = require("../categories/Category");
const router = require("../users/UserController");
const session = require("express-session");



//routes.get ("/session", (req, res) =>{
//    req.session.treinamento = "Formação nodeJS"
//    req.session.ano = 2019
//    req.session.email = "shauhsaushu@gmail.com"

//    res.send("Sessão gerada!")
//});

//routes.get ("/leitura", (req, res) =>{
//    res.json({
//        treinamento: req.session.treinamento,
//        ano: req.session.ano
//    })
//});


routes.get("/", (req, res) =>{
    Article.findAll ({
        order:[
            ['id', 'DESC']
            
        ],
        limit:4
    }).then(articles =>{
        Category.findAll().then(categories =>{
            res.render("index", {articles:articles, categories:categories}); 
        })
       
    });
});

routes.get("/:slug", (req, res) =>{
    var slug = req.params.slug;
    Article.findOne ({
        where : {
            slug : slug
        } 
    }).then(article =>{
        if (article != undefined){
            Category.findAll().then(categories =>{
                res.render("article", {article:article, categories:categories}); 
            })
        }else{
            res.redirect("/");
        }
    }).catch (err =>{
        res.redirect("/");
    });
});

routes.get ("/category/:slug", (req,res) =>{
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug : slug
        },
        include: [{model : Article}]
    }).then( category =>{
        if (category != undefined){
            Category.findAll().then(categories =>{
                res.render ("index", {articles : category.articles, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err =>{
        res.redirect("/");
    });
});



module.exports = routes;