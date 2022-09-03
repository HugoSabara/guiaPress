const express = require("express");
const routes = express("routes");
const Category = require("./Category");
const slugify = require("slugify");
const { Router } = require("express");
const adminAuth = require("../middlewares/adminAuth");

routes.get("/admin/categories/new",adminAuth, (req, res) =>{
     res.render("admin/categories/new") ;  
});

routes.post("/categories/salve",adminAuth, (req, res) =>{
    var title = req.body.title;
    if (title != undefined){
        Category.create({
            title : title,
            slug: slugify(title)
        }).then(() =>{
             res.redirect("/admin/categories");
        })
    }else{
       res.redirect("admin/categories/new");
    }
});

routes.get("/admin/categories",adminAuth, (req, res) =>{
    Category.findAll().then(categories =>{
        res.render("admin/categories/index",{categories:categories});
    });
    
});

routes.post("/categories/delete",adminAuth, (req, res) =>{
    var id = req.body.id;
    
    if (id != undefined){
        if (!isNaN(id)){
            Category.destroy({
                where: {
                    id:id
                }
            }).then(() =>{
                res.redirect("/admin/categories");    
            });
        }else{//NÃO FOR NÚMERO
            res.redirect("/admin/categories");
        }
    }else{ //NULL
        res.redirect("/admin/categories");
    }
});

routes.get("/admin/categories/edit/:id",adminAuth, (req, res) =>{
    var id = req.params.id;
    if (isNaN(id)){
        res.redirect("/admin/categories")
    }
    Category.findByPk(id).then (category  =>{
        if (category != undefined){
            res.render("admin/categories/edit", {category:category})
        }else{
            res.redirect("/admin/categories") 
        }
    }).catch(erro =>{
        res.redirect("/admin/categories")
    });
});

routes.post("/categories/update",adminAuth, (req, res) =>{
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title:title, slug: slugify(title)},{
            where:{
                id:id
            }
        }).then(()=>{
            res.redirect("/admin/categories")
    });

});

module.exports = routes;
