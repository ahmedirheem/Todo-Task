const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()
const PORT = process.env.PORT || 4000
const app = express()

// DataBase connection
// , {userNewUrlParser: true, useUnifiedTopology: true}
mongoose.connect(process.env.DB_ULI)
let db = mongoose.connection
db.on("error", error => console.log(error))
db.once("open", ()=>console.log('Connected to db'))

// Middelwares
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(session({
    secret: "My Secret Key",
    saveUninitialized: true,
    resave: false,
}))

app.use((req, res, next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

// Templet Engine
app.set("view engine", "ejs")

app.use('/css', express.static(path.resolve(__dirname, 'assets/css')))
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')))

app.use('', require('./routes/routes'))

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})