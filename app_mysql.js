var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
//    if(파일의 형식이 이미지면)
      cb(null, 'uploads/');  //uploads/images
//    else if(파일의 형식이 텍스트면)
//      cb(null, 'uploads/texts')
  },
  filename: function(req, file, cb) {
//  if(만약 이미 파일이 존재한다면)
      cb(null, file.originalname);  //추가적인 숫자를 붙인다.
//  else
//    cb(null, file.originalname);
  }
})
var upload = multer({ storage: storage })
var fs = require('fs');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '111111',
  database : 'o2'
});
connection.connect();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.locals.pretty = true;
app.set('views', './views_mysql');
app.set('view engine', 'jade');
app.use('/user', express.static('uploads'));
app.get('/upload', function(req, res) {
  res.render('upload');
});

// upload 미들웨어가 function이 실행되기 전에 실행된다.
// single의 인자는 upload.jade에서 선언한 name값(userfile)이 된다.
// 사용자가 전송한 데이터에서 파일이 있을 경우, 파일을 가공해서 req객체의 file이라는 프로퍼티를 암시적으로 추가해주는 미들웨어
// function이 실행될 때, file이라는 프로퍼티가 추가되어 있다. => req.file
app.post('/upload', upload.single('userfile'), function(req, res) {
  res.send(req.file);
});

app.get('/topic/add', function(req, res) {
  var sql = 'SELECT id, title FROM topic';
  connection.query(sql, function(err, topics, fields) {
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('add', {topics:topics});
  });
});

app.post('/topic/add', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
  connection.query(sql, [title, description, author], function(err, result, fields) {
    if(err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/topic/' + result.insertId);
    }
  });
});

app.get('/topic/:id/edit', function(req, res) {
  var sql = 'SELECT id, title FROM topic';
  connection.query(sql, function(err, topics, fields) {
    var id = req.params.id;
    if(id) {
      var sql = 'SELECT * FROM topic WHERE id = ?';
      connection.query(sql, [id], function(err, topic, fields) {
        if(err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('edit', {topics:topics, topic:topic[0]})
        }
      });
    } else {
      console.log('There is no id.');
      res.status(500).send('Internal Server Error');
    }
  });
});

app.post('/topic/:id/edit', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
  connection.query(sql, [title, description, author, id], function(err, result, fields) {
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/topic/' + id);
    }
  });
});

app.get('/topic/:id/delete', function(req, res) {
  var sql = 'SELECT id, title FROM topic';
  var id = req.params.id;
  connection.query(sql, function(err, topics, fields) {
    var sql = 'SELECT * FROM topic WHERE id=?';
    connection.query(sql, [id], function(err, topic) {
      if(err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        if(topic.length === 0) {
          console.log('There is no record.');
          res.status(500).send('Internal Server Error');
        } else {
          res.render('delete', {topics:topics, topic:topic[0]});
        }//else
      }//else
    });//connection.query
  });//connection.query
});

app.post('/topic/:id/delete', function(req, res) {
  var id = req.params.id;
  var sql = 'DELETE FROM topic WHERE id=?';
  connection.query(sql, [id], function(err, result) {
    res.redirect('/topic/');
  });
});

app.get(['/topic', '/topic/:id'], function(req, res) {
  var sql = 'SELECT id, title FROM topic';
  connection.query(sql, function(err, topics, fields) {
    var id = req.params.id;
    if(id) {
      var sql = 'SELECT * FROM topic WHERE id = ?';
      connection.query(sql, [id], function(err, topic, fields) {
        if(err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('view', {topics:topics, topic:topic[0]})
        }
      });
    } else {
      res.render('view', {topics:topics})
    }
  });
});

app.listen(3000, function() {
  console.log('Connected 3000 port!');
});
