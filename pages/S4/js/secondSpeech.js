var final_transcript2 = '';
var recognizing2 = false;
var ignore_onend2;
var start_timestamp2;
//If out of date
if (!('webkitSpeechRecognition' in window)) {
  upgrade2();
} else {//Setup voice recognition with continuous listening and interim results
  document.getElementById("start_button2").style.display = 'inline-block';
  var recognition2 = new webkitSpeechRecognition();
  recognition2.continuous = true;
  recognition2.interimResults = true;

  //Start of voice recognition2
  recognition2.onstart = function() {
    recognizing2 = true;
    showInfo2('info_speak_now');
    start_img2.src = 'images/mic-animate.gif';
  };

  //Error in Voice recognition2
  recognition2.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img2.src = 'images/mic.gif';
      showInfo2('info_no_speech');
      ignore_onend2 = true;
    }
    if (event.error == 'audio-capture') {
      start_img2.src = 'images/mic.gif';
      showInfo2('info_no_microphone');
      ignore_onend2 = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp2 < 100) {
        showInfo2('info_blocked');
      } else {
        showInfo2('info_denied');
      }
      ignore_onend2 = true;
    }
  };

  recognition2.onend = function() {
    recognizing2 = false;
    if (ignore_onend2) {
      return;
    }
    start_img2.src = 'images/mic.gif';
    if (!final_transcript2) {
      showInfo2('info_start');
      return;
    }
    showInfo2('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range2 = document.createRange();
      range2.selectNode(document.getElementById('final_span2'));
      window.getSelection().addRange(range2);
    }
  };

  recognition2.onresult = function(event) {
    var interim_transcript2 = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript2 += event.results[i][0].transcript;
      } else {
        interim_transcript2 += event.results[i][0].transcript;
      }
    }
    final_transcript2 = capitalize2(final_transcript2);
    final_span2.innerHTML = linebreak2(final_transcript2);
    interim_span2.innerHTML = linebreak2(interim_transcript2);
    if (final_transcript2 || interim_transcript2) {
      showButtons2('inline-block');
    }
  };
}

function upgrade2() {
  start_button2.style.visibility = 'hidden';
  showInfo2('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak2(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize2(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton2(event) {
  if (recognizing2) {
    recognition2.stop();
    return;
  }
  final_transcript2 = '';
  recognition2.lang = "United States";
  recognition2.start();
  ignore_onend2 = false;
  final_span2.innerHTML = '';
  interim_span2.innerHTML = '';
  start_img2.src = 'images/mic-slash.gif';
  showInfo2('info_allow');
  showButtons2('none');
  start_timestamp2 = event.timeStamp;
}

function showInfo2(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}

var current_style2;
function showButtons2(style) {
  if (style == current_style2) {
    return;
  }
  current_style2 = style;
}
