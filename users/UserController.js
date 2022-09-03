const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypjs = require("bcryptjs");

router.get("/admin/users", (req, res) => {
   User.findAll().then (users =>{
        res.render("admin/users/index", {users : users} );
   });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});


router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: {email:email}}).then( user => {
        if (user == undefined) {

            var salt = bcrypjs.genSaltSync(10);
            var hash = bcrypjs.hashSync(password, 10);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/");
            });

        } else {
            res.redirect("/admin/users/create");
        }
    });
});

router.get("/users/login", (req, res) => {
    res.render("admin/users/login");    
});

router.post("/authenticate", (req, res) =>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: {email:email}}).then( user => {
        if (user != undefined) { //se existe usuario com email validar a senha.
            var correct = bcrypjs.compareSync(password, user.password);

            if (correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
                
            }else{
                res.redirect("/users/login");    
            }
        }else{
            res.redirect("/users/login");
        }

    });    

});

router.get("/users/logout", (req, res) =>{
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;
