(function () {
    /** 対応記法
     * - ノーマルテキスト
     * - 多段箇条書き
     * - 見出し
     * - 画像
     * - リンク
     **/

    var markdownIndent = (level=0) => {
        var indent = '';
        for (var u = 0; u < level; u++) {
            // 半角スペース4個ぶん
            indent += '    ';
        }
        return indent;
    };

    // level小: 文字小 (Scrapbox記法に準ずる)
    // 1 <= level <= MAX_LEVEL
    // (MAX_LEVEL + 1) - level: 「#」の数
    var headlineMark = (level=1) => {
        var MAX_LEVEL = 5;
        var numMarks = (MAX_LEVEL + 1) - level;
        var r = '';
        for (var i = 0; i < numMarks; i++) {
            r += '#';
        }
        return r;
    }

    var headline = (text='') => {
        var div = document.createElement("div");
        div.innerHTML = text;
        var strongTags = div.querySelectorAll('strong');
        for (var i = 0; i < strongTags.length; i++) {
            var strong = strongTags[i];
            var level = +(strong.className.split('level-')[1]);
            var title = strong.innerHTML;
            strong.innerHTML = `${headlineMark(level)} ${title}`;
        }
        return div.innerHTML;
    };

    var links = (text='') => {
        var div = document.createElement("div");
        div.innerHTML = text;

        var aTags = div.querySelectorAll('a');
        for (var i = 0; i < aTags.length; i++) {
            var a = aTags[i];
            var aHtml = a.innerText.trim();
            var aHref = a.href;
            var linkMarkdown = `[${aHtml}](${aHref})`;

            // 画像対応
            var img = a.querySelector('img');
            if (img !== null) {
                linkMarkdown = `[![Image](${img.src})](${aHref})`;
            }

            a.innerText = linkMarkdown;
        }
        return div.innerText;
    };


    var lines = document.querySelector('.lines');
    var pageTitle = lines.querySelector('.line-title .text').innerText;
    var indentUnitWidthEm = 1.5

    lines = lines.querySelectorAll('.line');
    for (var i = 1; i < lines.length; i++) {
        var line = lines[i].querySelector('.text');
        var html = line.innerHTML.replace(/<span>/g, '');
        html = html.replace(/<span.+?>/g, '').replace(/<\/span>/g, '');
        html = html.replace(/<br.+?>/g, '');
        var text = html.replace(/\n/gi, '').replace(/\t/gi, '');

        text = headline(text);
        text = links(text);

        // 箇条書き対応
        var liDot = line.querySelector('.indent-mark');
        if (liDot !== null) {
            // 箇条書きの入れ子構造を取得
            var width = +((liDot.style.width).split('em')[0]);
            var indentLevel = width / indentUnitWidthEm;
            text = markdownIndent(indentLevel) + '- ' + text;
        }

        console.info(text);
    }
})();
