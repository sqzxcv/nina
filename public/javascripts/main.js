// $.getJSON('/awesome.json', function (data) {
//   console.log(data)
// })

function getURLParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return decodeURI(r[2]);
  return null; //返回参数值
}

window.onload = function () {
  // 
  $("#audioPlay1").attr("src", info['audio']);
  $("#audio_title_0").text(info['title']);
  var arr = info['url'].split('/');
  var source = ""
  if (arr.length > 2) {
    source = arr[2];
  } else {
    source = "未设置"
  }
  $("#audio_source_0").text(source)

  player();

  // $('#content').text(info['content'])
  $('#content').append(info['contentHtml'])
}

function player() {
  console.log('player init');

  var audio = document.getElementsByTagName('audio')[0]; // id for audio element
  var audioWrapper = document.getElementById('music'); // audio interface
  var duration; // Duration of audio clip
  var pButton = document.getElementById('pButton'); // play button

  var playhead = document.getElementById('playhead');
  var timeline = document.getElementById('timeline');
  var playLength = document.getElementsByClassName('audio_length')[0];
  // timeline width adjusted for playhead
  timeline.style.width = audioWrapper.offsetWidth + "px";
  var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
  var playIcon = document.getElementsByClassName('icon_audio_default')[0];
  var playingIcon = document.getElementsByClassName('icon_audio_playing')[0];

  audioWrapper.addEventListener("click", function () {
    play();
  }, false);

  // timeupdate event listener
  audio.addEventListener("timeupdate", timeUpdate, false);

  //Makes timeline clickable
  timeline.addEventListener("click", function (event) {
    // moveplayhead(event);
    // audio.currentTime = duration * clickPercent(event);
  }, false);

  // returns click as decimal (.77) of the total timelineWidth
  function clickPercent(e) {
    return (e.pageX - timeline.offsetLeft) / timelineWidth;
  }

  // Makes playhead draggable
  playhead.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mouseup', mouseUp, false);

  // Boolean value so that mouse is moved on mouseUp only when the playhead is released
  var onplayhead = false;
  // mouseDown EventListener
  function mouseDown() {
    onplayhead = true;
    window.addEventListener('mousemove', moveplayhead, true);
    audio.removeEventListener('timeupdate', timeUpdate, false);
  }

  // mouseUp EventListener
  // getting input from all mouse clicks
  function mouseUp(e) {
    if (onplayhead === true) {
      moveplayhead(e);
      window.removeEventListener('mousemove', moveplayhead, true);
      // change current time
      audio.currentTime = duration * clickPercent(e);
      audio.addEventListener('timeupdate', timeUpdate, false);
    }
    onplayhead = false;
  }

  // mousemove EventListener
  // Moves playhead as user drags
  function moveplayhead(e) {
    var newMargLeft = e.pageX - timeline.offsetLeft;
    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
      playhead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
      playhead.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
      playhead.style.marginLeft = timelineWidth + "px";
    }
  }

  // timeUpdate
  // Synchronizes playhead position with current point in audio
  function timeUpdate() {
    var playPercent = timelineWidth * (audio.currentTime / duration);
    playhead.style.width = playPercent + "px";
    if (audio.currentTime == duration) {
      playIcon.style.display = "inline-block";
      playingIcon.style.display = "none";
    }
  }

  //Play and Pause
  function play() {
    // start audio
    if (audio.paused) {
      audio.play();
      // toggle icons display
      playIcon.style.display = "none";
      playingIcon.style.display = "inline-block";
    } else { // pause audio
      audio.pause();
      playIcon.style.display = "inline-block";
      playingIcon.style.display = "none";
    }
  }

  // Gets audio file duration
  audio.addEventListener("canplaythrough", function () {
    duration = audio.duration;
    playLength.textContent = timeFormat(Math.floor(duration));
  }, false);

  // when audio stop
  audio.addEventListener("ended", function () {
    playIcon.style.display = "inline-block";
    playingIcon.style.display = "none";
  }, false);

  function timeFormat(timestamp) {
    var date = new Date(parseInt(timestamp) * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minite = date.getMinutes();
    var second = date.getSeconds();
    return minite + ":" + second;
  }

};