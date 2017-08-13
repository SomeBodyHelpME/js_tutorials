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
var OrientDB = require('orientjs');
var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '111111'
});
var db = server.use('o2');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.locals.pretty = true;
app.set('views', './views_orientdb');
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
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics) {
    res.render('add', {topics:topics});
  });//db.query
});

app.post('/topic/add', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUES (:title, :description, :author)';
  db.query(sql, {
    params:{
      title:title,
      description:description,
      author:author
    }
  }).then(function(results) {
    res.redirect('/topic/' + encodeURIComponent(results[0]['@rid']));
  })
});

app.get('/topic/:id/edit', function(req, res) {
  var sql = 'SELECT FROM topic';
  var id = req.params.id;

  db.query(sql).then(function(topics) {
    var sql = 'SELECT FROM topic WHERE @rid=:rid';
    db.query(sql, {params:{rid:id}}).then(function(topic) {
      res.render('edit', {topics:topics, topic:topic[0]});
    })
  });//db.query
});

app.post('/topic/:id/edit', function(req, res) {
  var sql = 'UPDATE topic SET title=:t, description=:d, author=:a WHERE @rid=:rid';
  var id = req.params.id;
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;

  db.query(sql, {
    params:{
      t:title,
      d:description,
      a:author,
      rid:id
    }
  }).then(function(topics) {
    res.redirect('/topic/' + encodeURIComponent(id));
  });//db.query
});

app.get('/topic/:id/delete', function(req, res) {
  var sql = 'SELECT FROM topic';
  var id = req.params.id;

  db.query(sql).then(function(topics) {
    var sql = 'SELECT FROM topic WHERE @rid=:rid';
    db.query(sql, {params:{rid:id}}).then(function(topic) {
      res.render('delete', {topics:topics, topic:topic[0]});
    })
  });//db.query
});

app.post('/topic/:id/delete', function(req, res) {
  var sql = 'DELETE FROM topic WHERE @rid=:rid';
  var id = req.params.id;

  db.query(sql, {
    params:{
      rid:id
    }
  }).then(function(topics) {
    res.redirect('/topic/');
  });//db.query
});

app.get(['/topic', '/topic/:id'], function(req, res) {
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics) {
    var id = req.params.id;
    if(id) {
      var sql = 'SELECT FROM topic WHERE @rid=:rid';
      db.query(sql, {params:{rid:id}}).then(function(topic) {
        res.render('view', {topics:topics, topic:topic[0]});
      })
    } else {
      res.render('view', {topics:topics})
    }
  });
});



app.listen(3000, function() {
  console.log('Connected 3000 port!');
});
