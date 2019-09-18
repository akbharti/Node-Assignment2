const mysql = require('mysql');
const utils = require('util');

  let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root", 
    database: "pariwar"
  });

   con.connect( (err) =>{
      if (err) throw err;
    });

    con.query = utils.promisify(con.query);

    let validation = require('./validation.js');
   
    //Create post  
    exports.insert=  (row)=>{

        let [pname,pdob,...child] = row;

        let flag = true;

        for(let j=0;j<row.length;j=j+2)
        {
            flag = validation.isValidDate(row[j+1]);
            if(flag == false)
             break;
        }

        if(!(row.length % 2 ==0) || (flag == false) )
        {
            let sqlInsert = `INSERT INTO error (errData) VALUES ('${row}')`;  
    
            con.query(sqlInsert,   (err, result, fields) =>{
             if (err) 
                console.log(err);
            console.log("Error : " , JSON.stringify(result));
           });
        }
        else
        {
            let sqlInsert = `INSERT INTO parent (name,dob) VALUES ('${pname}','${pdob}')`;  
    
            con.query(sqlInsert,   (err, result, fields) =>{
             if (err) 
                console.log(err);
                else{
                        console.log("Parent : " , JSON.stringify(result));

                        for(let i=0;i<child.length;i=i+2) { 
                            let sqlInsert = `INSERT INTO child (pid,name,dob) VALUES ('${result.insertId}','${child[i]}','${child[i+1]}')`;  
                
                             con.query(sqlInsert,   (err, result, fields) =>{
                             if (err) 
                             console.log(err);
                                 console.log("Child : " , JSON.stringify(result));
                             });
                         }
            
                }
           });

       
        }//else closed

     };