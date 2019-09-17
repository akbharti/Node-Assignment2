
const express = require("express");
const bodyParser = require('body-parser')


let app = express();
let PORT = 3030; 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


let service = require('./service.js');




app.post('/getData',service.getData);


app.listen(PORT,()=>{console.log(`Express server is on port no. ${PORT}`);});