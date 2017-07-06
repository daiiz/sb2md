exports.detectGyazoId = url => {
  gyazoId = null;
  if (url.indexOf('gyazo.com/') > 0) {
    gyazoId = url.split('gyazo.com/')[1];
    gyazoId = gyazoId.split('/')[0].split('.')[0];
  }
  return gyazoId;
};

exports.willDownloadGyazoUrls = (texCodes=[], existingGyazoIds=[]) => {
  // TeXコードに含まれるGyazoIDを調べる
  // ダウンロードすべきコンテンツのURLリストを構成する
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
