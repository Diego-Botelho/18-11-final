const express = require("express");
const sequelize = require("./database/database.js");

const Movie = require("./models/Movie.js");
const Hero = require("./models/Hero.js");
const heroesRoutes = require("./routes/heroes.routes.js")

const app = express(); // express node e api
app.use(express.json());

// CORS: permite que o frontend (outra porta/origem) converse com a API
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

Hero.belongsToMany(Movie,{
    through: "HeroMovies"
})

Movie.belongsToMany(Hero,{
    through: "MoviesHero"
})

app.use("/heroes", heroesRoutes);

sequelize
    .sync()
    .then(()=> {
        console.log("Banco de Dados sincronizado");
        
    })
    .catch((error) => {
        console.log("Erro a sincronizar o Banco", error);
        
    })

module.exports = app;