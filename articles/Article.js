const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");


const Article = connection.define ('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})


//UMA CATERGORIA TEM MUITOS ARTIGOS. (1->PARA -> N).
Category.hasMany(Article);

//UM ARTIGO PERTENCE A UMA CATEGORIA.(1->PARA-> 1).
Article.belongsTo(Category);

//SINCRONIZAR COM BANCO.
//Article.sync({force:true});

module.exports = Article;