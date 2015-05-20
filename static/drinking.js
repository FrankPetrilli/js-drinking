var req;
var word;
var result;
var xmlHttpTimeout;
var clearBoxTimeout;
window.onload = function() {
	req = new XMLHttpRequest();

	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if (req.responseText.length > 0) {
				clearInterval(xmlHttpTimeout);
				packageFound(req.responseText);
			}
		}
	};
	word = document.getElementById('word');
	word.onkeypress = function(e) {
		if (e.keyCode == 13) {
			check();
		}
	};
	result = document.getElementById('result');
	document.getElementById('submit').onclick = check;
	document.getElementById('submit-random').onclick = function() {
		console.log('checking random...');
		word.value = getRandomWord();
		check();
	};
}
function getRandomWord() {
	var serverSide = true;
	if (serverSide) {
		wordReq = new XMLHttpRequest();
		wordReq.open('GET', '/api/word/', false);
		wordReq.send(null);
		if (wordReq.readyState == 4) {
			var result = JSON.parse(wordReq.responseText);
			if (result.success) {
				return result.word;
			}
		}

	} else {
		var nouns = [ 'five', 'house', 'cat', 'fan' ];
		return nouns[Math.floor(Math.random() * nouns.length)];
	}
}

function packageFound(responseText) {
	var response = JSON.parse(responseText);
	if (response.success) {
		clearInterval(clearBoxTimeout);
		if (response.exists) {
			result.innerHTML = 'Take a drink!';
			result.innerHTML += '<br>';
			result.innerHTML += '<a href="' + response.link + '">' + response.name + '</a>';
		} else {
			result.innerHTML = 'You\'re safe.';
		}
		clearBoxTimeout = setTimeout(clear, 7000);
	}
}

function check() {
	console.log('sending check');
	var timeout = 10000;
	req.timeout = timeout;
	req.open('GET', '/api/exists/' + word.value, true);
	req.send(null);
	xmlHttpTimeout = setTimeout(ajaxTimeout, timeout);
	result.innerHTML = 'Loading...';
}

function clear() {
	result.innerHTML = null;
}

function ajaxTimeout() {
	clear();
	alert('check timed out');
}
