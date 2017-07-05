(function () {
 	var sum = 0;
 	var formula = (line) => {
    	var eqs = line.querySelectorAll('.formula');
        for (var i = 0; i < eqs.length; i++) {
  			var eq = eqs[i];
      		var annotation = eq.querySelector('annotation');
         	eq.innerHTML = ' $' + annotation.innerHTML + '$ ';
     	}
        return line;
    };

	var lines = document.querySelector('.lines');
 	lines = lines.querySelectorAll('.line');
   	var foundStartLine = false;
   	for (var i = 1; i < lines.length; i++) {
   		var line = lines[i].querySelector('.text').cloneNode(true);
     	var hr = line.querySelector('img.icon[src="/api/pages/icons/hr/icon"]');
    	// 変換対象の末尾
       	if (foundStartLine && hr) break;
       	// 変換対象の開始
       	if (hr) {
       	    foundStartLine = true;
       		continue;
        }
   		// 変換対象開始前
   		if (!foundStartLine) continue;

      	line = formula(line);
      	var tText = line.innerText.trim().replace(/ /g, '');

      	sum += tText.length;
   }
   alert(`${sum} 文字`);
})();
