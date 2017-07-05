const express = require('express');
const app = express();
const http = require('http').Server(app);
const PORT = process.env.PORT || 8102;
const request = require('request');
const fs = require('fs');
const spawn = require('child_process').spawn;

http.listen(PORT, function () {
  console.log(`sb2tex app listening on port ${PORT}!`);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/make/pdf', function (req, res) {
  var msg = {};
  var url = 'https://gyazo.com/5effba89fde2496d1eeb036df40d5bd4/raw';
  var gyazoId = '5effba89fde2496d1eeb036df40d5bd4';
  // ダウンロード候補のパス集合を構成する
  // ファイルが存在するか?
  // ダウンロード実行
  // ビルド
  var proxy = request.defaults({'proxy': 'http://proxy.uec.ac.jp:8080/'});
  var ext = 'png';
  proxy.get(url).on('response', function (res) {
    console.log('statusCode: ', res.statusCode);
    console.log('content-length: ', res.headers['content-length']);
    var contentType = res.headers['content-type'];
    if (contentType.indexOf('jpg') !== -1 || contentType.indexOf('jpeg') !== -1) ext = 'jpg';
    console.log(77777)
  }).pipe(fs.createWriteStream(`./gyazos/${gyazoId}.${ext}`)).on('close', function () {
    console.log(88888)
    var makePdf = spawn('sh', ['make_pdf.sh']);
    makePdf.stdout.on('data', (data) => {
      console.log(data.toString());
      res.send(JSON.stringify(msg));
    });
  });
});
