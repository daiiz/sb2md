const express = require('express');
const bodyParser = require('body-parser');
const tools = require('./tools');
const app = express();
const http = require('http').Server(app);
const request = require('request');
const fs = require('fs');
const spawn = require('child_process').spawn;
const PORT = process.env.PORT || 8102;
var proxy;

var fetchFiles = (urls, callback) => {
  if (urls.length === 0) {
    if (callback) callback();
  }else {
    var url = urls.pop();
    var gyazoId = tools.detectGyazoId(url);
    if (gyazoId) {
      var ext = 'png';
      proxy.get(url).on('response', function (res) {
        console.log('>', url);
        var contentType = res.headers['content-type'];
        if (contentType.indexOf('jpg') !== -1 || contentType.indexOf('jpeg') !== -1) ext = 'jpg';
      }).pipe(fs.createWriteStream(`./gyazos/${gyazoId}.${ext}`)).on('close', function () {
        fetchFiles(urls, callback);
      });
    }else {
      fetchFiles(urls, callback);
    }
  }
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
  proxy = request.defaults({'proxy': req.body.proxy || ''});

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
    var gyazoUrls = tools.willDownloadGyazoUrls(texCodes, existingGyazoIds);
    var shFileName = `create_pdf.sh`;
    if (gyazoUrls.length > 0) {
      shFileName = `create_pdf_full.sh`;
    }
    console.log('download list', gyazoUrls);

    // 画像ダウンロード実行
    fetchFiles(gyazoUrls, function () {
      // PDFを作成
      var createPdf = spawn('sh', [shFileName]);
      console.log('(standby)', shFileName);
      createPdf.stdout.on('data', (data) => {
        console.log(data.toString());
      });
    });

    res.json({});
  });
});
