const express = require('express');
const mysql = require('mysql');

const app = express(express.json());
//app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/*
//database connection
db = mysql.createConnection({
    host    : '192.168.1.180',
    user    : 'commander',
    password: 'abc123',
    database: 'pi4web'
});
*/
db = mysql.createPool({
    host    : '192.168.1.180',
    user    : 'commander',
    password: 'abc123',
    database: 'pi4web'
});

db.on('error', function(err) {
    console.log(err.code); // 'ER_BAD_DB_ERROR'
});

//create table
app.get('/createtable', (req, res) => {
    let sql = 'CREATE TABLE commands (id int(5) auto_increment primary key, name varchar(25), howTo varchar(255), options varchar(255), platform varchar(25), description varchar(255)';
    db.query(sql, sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('table created...')
    })
});

//select posts
app.get('/getposts', (req, res) => {
    let sql = 'SELECT * FROM commands';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log("All: " + results)
        res.send(results);
    })
})

//search for post
app.get('/getposts/:searchString', (req, res) => {
    let sql = `SELECT * FROM commands WHERE name like \'%${req.params.searchString}%\'`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results)
        res.send(results);
    })
})

//select single post
app.get('/getpost/:id', (req, res) => {
    let sql = `SELECT * FROM commands WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result[0])
        res.send(result[0]);
    })
})

//update post
app.post('/updatepost/:id', (req, res) => {
    let newname = 'cd'
    let sql = `UPDATE commands SET name = '${newname}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result)
        res.send(result);
    })
})

//delete post
app.delete('/deletepost/:id', (req, res) => {
    let sql = `DELETE FROM commands WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results)
        res.send('Post deleted');
    })
})

//insert data
app.get('/addpost', (req, res) => {
    let post = {name: 'ls', howTo: 'ls', options: '-a, -d', platform: 'linux', description: 'list files and directorys'};
    let sql = 'INSERT INTO commands SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Post added to table')
    })
})

/*
//connect
db.connect((err) => {
    if(err){
        console.log(err)
    }else{
        console.log("Connected to db")
    }
})*/

app.listen('5555', () => {
    console.log("Server is up on port 5555")
});