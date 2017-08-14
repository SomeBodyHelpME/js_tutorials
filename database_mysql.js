var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '111111',
  database : 'o2'
});
connection.connect();

// SELECT
/*
var sql = 'SELECT * FROM topic';
connection.query(sql, function(err, rows, fields) {
  if(err) {
    console.log(err);
  } else {
    for(var i = 0 ; i < rows.length ; i++) {
      console.log(rows[i].author);
    }
  }
});
*/
// INSERT
/*
var sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
var params = ['BBB', 'BCD', 'DEC'];
connection.query(sql, params, function(err, rows, fields) {
  if(err) {
    console.log(err);
  } else {
    console.log(rows.insertId);
  }
});
*/
// UPDATE
/*
var sql = 'UPDATE topic SET title=?, description=? WHERE id=?';
var params = ['ZZZ', 'YYY', 11];
connection.query(sql, params, function(err, rows, fields) {
  if(err) {
    console.log(err);
  } else {
    console.log(rows);
  }
});
*/
// DELETE
/*
var sql = 'DELETE FROM topic WHERE id=?';
var params = [10];
connection.query(sql, params, function(err, rows, fields) {
  if(err) {
    console.log(err);
  } else {
    console.log(rows);
  }
});
*/
