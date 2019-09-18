const fs = require('fs');
const formidable = require('formidable');

let da = require('./da.js');

exports.getData = (req,res) =>
{
 
    let form = new formidable.IncomingForm();
    
    form.parse(req, function (err, fields, files) {
    //console.log(files)
        fs.readFile(files.foo.path,'utf8',function (err, data) {

        let arr = data.split('\r\n')
            arr.shift();
            
            let rowData = []
            arr.forEach(item =>{
                    let ar = item.split(",")             
                    rowData.push(ar)
            })


            rowData.forEach(item =>  da.insert(item))

           res.send(data)

        });
    });

    
}