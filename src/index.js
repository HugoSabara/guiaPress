const express = require("express");
const server  = express();

const routes = require("./routes.js");
const bodyParser = require("body-parser");
const connection = require("../database/database");
const session = require("express-session");


const articlesController = require("../articles/ArticlesController")
const categoriesController = require("../categories/CategoriesController")
const usersController = require("../users/UserController");

const Article = require("../articles/Article");
const Category = require("../categories/Category");
const Users = require("../users/UserController");



//view engine
server.set('view engine', 'ejs');

//redis (banco para sessões).

//Sessões
server.use(session({
    secret: "qualquercoisa",
    resave: true,
    saveUninitialized: true,
    cookie:{maxAge: 3000000}
}));

//statis
server.use(express.static('public'));

//body-parser
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());



//conexão com banco.
connection
    .authenticate()
    .then(() => {
        console.log("Conexão com BD OK.")
    }).catch((error) => {
        console.log(error)
    });




//rotas
server.use(routes);
server.use(articlesController);
server.use(categoriesController);
server.use(usersController);


server.set(express.static('public'));

server.listen(8080, ()=> console.log("Servidor rodando"));