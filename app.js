var express = require('express');
var app = express();
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');

app.get('/topic', function(req, res) {
  var topics = [
    'Javascript is....',
    'Nodejs is....',
    'Express is....'
  ];
  var output = `
    <a href="/topic?id=0">Javascript</a><br>
    <a href="/topic?id=1">Nodejs</a><br>
    <a href="/topic?id=2">Express</a><br><br>
    ${topics[req.query.id]}
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
