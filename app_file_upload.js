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
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.locals.pretty = true;
app.set('views', './views_file');
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

app.get('/topic/new', function(req, res) {
  fs.readdir('data', function(err, files) {
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('new', {topics:files});
  });//fs.readdir
});

// app.get(['/topic', '/topic/:id'], function(req, res) {
//   fs.readdir('data', function(err, files) {
//     if(err) {
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//     }
//     res.render('view', {topics:files});
//   })
// });

app.get(['/topic', '/topic/:id'], function(req, res) {
  var id = req.params.id;
  fs.readdir('data', function(err, files) {
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    var id = req.params.id;
    if(id) {
      //id값이 있을 때
      fs.readFile('data/' + id, 'utf8', function(err, data) {
        if(err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('view', {topics:files, title:id, description:data})
      }); //fs.readFile
    } else {
      //id값이 없을 때
      res.render('view', {topics:files, title:'Welcome', description:'Hello, Javascript for server.'});
    }//else
  });//fs.readdir
});

app.post('/topic', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/' + title, description, function(err) {
    if(err) {
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/' + title);
  });
});

app.listen(3000, function() {
  console.log('Connected 3000 port!');
});
