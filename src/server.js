require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";

//dependencies (connecting to mongodb)
var mongoose = require('mongoose');
var conn = mongoose.connection;


let app = express();

//config view engine
viewEngine(app)

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//init web routes
initWebRoutes(app);

let port = process.env.PORT || 8080;

app.listen(port, ()=>{
    console.log("App is running at the port: "+ port)
})


mongoose.connect('mongodb://localhost:27017/nodeapp', {useNewUrlParser: true});
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;