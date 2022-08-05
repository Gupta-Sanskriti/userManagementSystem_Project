const mysql = require("mysql");

// Connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS, //set the password as password or run the queriy ("ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';", "flush privileges;")
  database: process.env.DB_NAME,
});

// View users
exports.view = (req, res) => {

  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log(`Connected as ID ${connection.threadId}`);
    // User the connection
    connection.query("SELECT * FROM users WHERE status='active'", (err, rows)=>{
        // When done with connection, release it.
        connection.release();
        if(!err){
            let removedUser = req.query.removed; //removed is comming form the delete vala query
             res.render('home', {rows,removedUser})
        }else{
            console.log(err)
        }
        // console.log(`The data from user table: ${JSON.stringify(rows)}`)
    })
  });
};

// Find user by search
exports.find = (req, res)=>{
    pool.getConnection((err, connection)=>{
        if(err) throw err;
        console.log(`Connected as ID ${connection.threadId}`);

        // grab the value from the body -- grabbing the search term by name
        let searchTerm = req.body.searchKey;

        // User the connection
        connection.query("SELECT * FROM users WHERE first_name LIKE ? OR last_name LIKE ?", ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows)=>{
            connection.release();
            if(!err){
                res.render('home', {rows});  // home is the name of handlebars page, which is being rendered on this url
            }else{
                console.log(err);
            }
            console.log(`The data from users table: ${JSON.stringify(rows)}`);
        })

    })
}

// render the form on add-user page
exports.form = (req, res)=>{
    res.render('add-user');
}

// Add new user
exports.create = (req, res)=>{
    const {first_name, last_name, email, phone, comment} = req.body;
    //res.render('add-user'); //add-user is the handlebar page name
    pool.getConnection((err, connection)=>{
        if(err) throw err;
        console.log(`Connected as ID ${connection.threadId}`)

        // connection query - user the connection
        connection.query("INSERT INTO users SET first_name = ?, last_name = ?, email=?, phone=?, comment=?", [first_name, last_name, email, phone, comment], (err, rows)=>{
            // release the connection
            connection.release();
            if (!err){
                res.render('add-user', {alert:"User added sucessfully!"})
            }else{
                console.log(err)
            }
            console.log(`The data from users table: ${JSON.stringify(rows)}`)

        })

    })

}

// render the Edit the data page
exports.renderEdit = (req, res)=>{
    // res.render('edit')

    pool.getConnection((err, connection)=>{
        if (err) throw err;
        console.log(`Connected as ID ${connection.threadId}`)

        // user the connection
        connection.query(`SELECT * FROM users WHERE id = ${req.params.id}`, (err, rows)=>{
            // release the connection
            connection.release();
            if(!err){
                res.render("edit", {rows})
            }else{
                console.log(err)
            }
            console.log("The data from user table: ", rows)
        } )
    })
}

// Update user
exports.update = (req, res)=>{
    const{first_name, last_name, email, phone, comment} = req.body;
    // console.log(req.body)
    // pool with db connection
    pool.getConnection((err, connection)=>{
        if(err) throw err;
        console.log(`Connected as ID ${connection.threadId}`)
        // user the connection
        connection.query("UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, comment = ? WHERE id = ?",[first_name, last_name, email, phone, comment, req.params.id], (err, rows)=>{
            // release the connection
            connection.release();
            if(!err){
                res.render('edit', {alert:`Updated the ${first_name} user sucessfully`})
                // establish the connection pool so the form does not go after submiting the form
                // pool.getConnection((err, connection)=>{
                //     if (err) throw err;
                //     console.log(`Connected as ID ${connection.threadId}`)
                //     connection.query(`SELECT * FROM user WHERE id= ${req.params.id}`, (err, rows)=>{
                //         connection.release();
                //         if(!err){
                //             res.render('edit-user', {rows, alert: `Updated data of ${first_name}`})
                //         }else{
                //             console.log(err)
                //         }
                //         console.log(`The data from user table: ${JSON.stringify(rows)}`)
                //     })
                // })
            }else{
                console.log(err)
            }
            console.log(`The data from user table : ${JSON.stringify(rows)}`)
        })
    })
}


// // added delete functionality by sanskriti
// exports.deleteUser = (req, res)=>{
//     pool.getConnection((err, connection)=>{
//         if (err) throw err;
//         console.log(`Connected as ID: ${connection.threadId}`)
//         connection.query(`SELECT * FROM users WHERE id = ${req.params.id}`, (err, rows)=>{
//             connection.release();
//             if(!err){
//                 res.render('home', {alert:`User Deleted sucessfully`})
//             }else{
//                 console.log(err)
//             }
//             console.log(`The data from user table: ${rows}`)
//         })
//     })
// }

// added delete functionality by sanskriti


// delete user
exports.deleteUser = (req, res)=>{
    // This will delete the user from the database,
    // pool.getConnection((err, connection)=>{
    //     if(err) throw err;
    //     console.log(`Connected ID: ${connection.threadId}`)

    //     connection.query(`DELETE FROM users WHERE id = ${req.params.id}`, (err, rows)=>{
    //         connection.release()
    //         if(!err){
    //             // res.render('home', {rows}) //--> instead of doing this we want to redirect the user to the home page.
    //             res.redirect('/')
    //         }else{
    //             console.log(err);
    //         }
    //         console.log(`The data from the user table: ${rows}`)
    //     })
    // })

    // if you wish to delete from the UI and mark that as deleted then Update the user not permanently delete it
    // we would see the users getting removed because in view api we are rendering the data whose status was set as active
    pool.getConnection((err, connection)=>{
        if(err) throw err;
        console.log(`Connected as ID : ${connection.threadId}`)
        connection.query(`UPDATE users SET status = 'removed' WHERE id=${req.params.id}`, (err, rows)=>{
            connection.release();
            if(!err){
                let removedUser = encodeURIComponent("User successfully removed.")
                res.redirect('/?removed='+removedUser)
            }else{
                console.log(err)
            }
            console.log(`The data from user table are: ${JSON.stringify(rows)}`)
        })
    })

}

// view user details
exports.viewuser = (req, res)=>{
    pool.getConnection((err, connection)=>{
        if(err) throw err;
        console.log(`Connected as ID: ${connection.threadId}`)
        connection.query(`SELECT * FROM users WHERE id = ${req.params.id}`, (err, rows)=>{
            connection.release();
            if(!err){
                res.render('view-user', {rows})
            }else{
                console.log(err)
            }
            console.log(`The data from user table ${JSON.stringify(rows)}`)
        })
    })
}
