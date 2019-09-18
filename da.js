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
    
            let eQuery =  con.query(sqlInsert);
            eQuery.then(res => console.log('Error : ',JSON.stringify(res)))
                   .catch(err => console.log("error in inserting in Error Table : ",err));

        //     con.query(sqlInsert,   (err, result, fields) =>{
        //      if (err) 
        //         console.log(err);
        //     console.log("Error : " , JSON.stringify(result));
        //    });
        }
        else
        {
            let sqlInsert = `INSERT INTO parent (name,dob) VALUES ('${pname}','${pdob}')`;  

            let pQuery =  con.query(sqlInsert);
            pQuery.then(res => {
                                     console.log('Parent : ',JSON.stringify(res))
                                //   console.log(res.insertId)

                                    for(let i=0;i<child.length;i=i+2) { 
                                     let sqlInsert1 = `INSERT INTO child (pid,name,dob) VALUES ('${res.insertId}','${child[i]}','${child[i+1]}')`;

                                     let cQuery =  con.query(sqlInsert1);
                                     cQuery.then(res => console.log('Child : ',JSON.stringify(res)))
                                           .catch(err => console.log("error in inserting in Child Table : ",err));
                                     }

                                })
                  .catch(err => console.log("error in inserting in Parent Table : ",err));

        //     con.query(sqlInsert,   (err, result, fields) =>{
        //      if (err) 
        //         console.log(err);
        //         else{
        //                 console.log("Parent : " , JSON.stringify(result));

        //                 for(let i=0;i<child.length;i=i+2) { 
        //                     let sqlInsert = `INSERT INTO child (pid,name,dob) VALUES ('${result.insertId}','${child[i]}','${child[i+1]}')`;  
                
        //                      con.query(sqlInsert,   (err, result, fields) =>{
        //                      if (err) 
        //                      console.log(err);
        //                          console.log("Child : " , JSON.stringify(result));
        //                      });
        //                  }          
        //         }
        //    });
   
        }//else closed

     };