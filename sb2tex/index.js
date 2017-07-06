const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const request = require('request');
const proxy = request.defaults({'proxy': 'http://proxy.uec.ac.jp:8080/'}); //'http://proxy.uec.ac.jp:8080/'});
const fs = require('fs');
const spawn = require('child_process').spawn;
const PORT = process.env.PORT || 8102;

// 複数のファイルダウンロード
var fetchFiles = (urls, callback) => {
  if (urls.length === 0) {
    if (callback) callback();
  }else {
    var url = urls.pop();
    console.log('>', url);

    proxy.get(url).on('response', function (res) {
      var contentType = res.headers['content-type'];
      if (contentType.indexOf('jpg') !== -1 || contentType.indexOf('jpeg') !== -1) ext = 'jpg';
    }).pipe(fs.createWriteStream(`./gyazos/${gyazoId}.${ext}`)).on('close', function () {
      fetchFiles(urls, callback);
    });
  }
};

var willDownloadGyazoUrls = (texCodes=[], existingGyazoIds=[]) => {
  // TeXコードに含まれるGyazoIDを調べる
  // ダウンロード候補のID集合を構成する
  var gyazoUrls = [];
  texCodes.forEach(row => {
    row = row.trim();
    if (row.startsWith('%%IMAGE;')) {
      var toks = row.split('\n')[0].split(';');
      var gyazoId = toks[1].trim();
      var gyazoUrl = `https://gyazo.com/${gyazoId.trim()}/raw`;
      if (gyazoUrls.indexOf(gyazoUrl) === -1 && existingGyazoIds.indexOf(gyazoId) === -1) {
        gyazoUrls.push(gyazoUrl);
      }
    }
  });
  return gyazoUrls;
};

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

http.listen(PORT, function () {
  console.log(`sb2tex app listening on port ${PORT}!`);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/create/pdf', function (req, res) {
  // TeXコードを受け取って保存
  var texCodes = req.body.texts;
  fs.writeFileSync(`${__dirname}/raw.tex`, texCodes.join('\n'));

  var existingGyazoIds = [];
  fs.readdir(`${__dirname}/gyazos/.`, function(err, files){
    // 既存のGyazoIDリストを作成
    for (var i = 0; i < files.length; i++) {
      var fName = files[i];
      if (fName.indexOf('/') === -1) {
        var id = fName.split('.')[0];
        if (id.length > 0 && existingGyazoIds.indexOf(id) === -1) {
          existingGyazoIds.push(id);
        }
      }
    }
    // 新規にダウンロードすべき画像を決定する
    var gyazoUrls = willDownloadGyazoUrls(texCodes, existingGyazoIds);
    var shFilePath = `${__dirname}/create_pdf.sh`;
    if (gyazoUrls.length > 0) {
      shFilePath = `${__dirname}/create_pdf_full.sh`;
    }
    console.log('download list', gyazoUrls, shFilePath);
  });

  // ダウンロード実行
  // ビルド
  // var makePdf = spawn('sh', ['make_pdf.sh']);
  // makePdf.stdout.on('data', (data) => {
  //   console.log(data.toString());
  // });
  // var ext = 'png';
  // var msg = {
  //   'gyazo_ids': [gyazoId]
  // };
  //
  // res.send(JSON.stringify(msg));
  res.send(JSON.stringify({}));
});
