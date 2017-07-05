const express = require('express');
const app = express();
const http = require('http').Server(app);
const PORT = process.env.PORT || 8102;

http.listen(PORT, function () {
  console.log(`sb2tex app listening on port ${PORT}!`);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/make/pdf', function (req, res) {
  var msg = {};
  res.send(JSON.stringify(msg));
});
