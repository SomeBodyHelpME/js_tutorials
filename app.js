var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/form', function(req, res) {
  res.render('form');
});

app.get('/form_receiver', function(req, res) {
  var title = req.query.title;
  var description = req.query.description;
  res.send(title + ',' + description);
});

app.post('/form_receiver', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  res.send(title + ',' + description);
});
app.get('/topic/:id', function(req, res) {
  var topics = [
    'Javascript is....',
    'Nodejs is....',
    'Express is....'
  ];
  var output = `
    <a href="/topic/0">Javascript</a><br>
    <a href="/topic/1">Nodejs</a><br>
    <a href="/topic/2">Express</a><br><br>
    ${topics[req.params.id]}
  `
  res.send(output);
})
app.get('/template', function(req, res) {
  res.render('temp', {_title:"hi"});
});
app.get('/', function(req, res) {
  res.send('Hello');
})
app.listen(3000, function() {
  console.log('Connected 3000 port!');
});
