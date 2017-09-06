var songmodel = `<div class="audio_wrp" id="music{{index}}" preload="true" docid={{doc_id}} audio={{audio}}>
<div class="audio_play_area play " id="pButton{{index}} ">
    <i class="icon_audio_default " id="icon_audio_default{{index}}"></i>
    <i class="icon_audio_playing " id="icon_audio_playing{{index}}"></i>
    <i>
        <div class="spinner" id="audioloading{{index}}">
            <div class="spinner-container container1">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
                <div class="circle4"></div>
            </div>
            <div class="spinner-container container2">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
                <div class="circle4"></div>
            </div>
            <div class="spinner-container container3">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
                <div class="circle4"></div>
            </div>
        </div>
    </i>
</div>
<div class="audio_length tips_global " id="audio_length{{index}}">{{newstime}}</div>
<div class="audio_info_area ">
    <strong class="audio_title " id="audio_title{{index}}">{{title}}</strong>
    <div class="audio_source tips_global " id="audio_source{{index}}">{{audiosource}}</div>
</div>
<div id="timeline{{index}}" class="progress_bar">
    <div id="playhead{{index}}"></div>
</div>
</div>`

window.onload = function () {
    var dom = songdom(results)
    $("#audiolist").append(dom)
    initPlayer(results, true)
}

var duration; // Duration of audio clip
var playLength 
var playhead, timelineWidth, playIcon, playingIcon;
var audioPlayingId;
var audioLoading;
function initPlayer(newAudioInfo, isAutoPlay) {

    if (newAudioInfo.length == 0) {
        return
    }

    var audio = document.getElementsByTagName('audio')[0]; // id for audio element
    // var audioWrapper = document.getElementById('music'); // audio interface

    // auto play
    // setTimeout(function(){
    //     play();
    // }, 2000);
    for (var index = 0; index < newAudioInfo.length; index++) {
        var element = newAudioInfo[index];
        var audioWrapper = document.getElementById('music' + element.doc_id);
        var playheadd = document.getElementById('playhead' + element.doc_id);
        var timeline = document.getElementById('timeline' + element.doc_id);
        timeline.style.width = audioWrapper.offsetWidth + "px";
        audioWrapper.addEventListener("click", function (event) {

            var docId = $("#"+event.currentTarget.id).attr("docid")
            play(docId);
        }, false);
    }

     //Play and Pause
     function play(audioid) {
        // start audio
        if (audio.paused) {
             //初始化播放数据
            playLength = document.getElementById("audio_length" + audioid)
            playhead = document.getElementById('playhead' + audioid)
            var currenttimeline = document.getElementById('timeline' + audioid);
            timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
            playIcon = document.getElementById("icon_audio_default" + audioid)
            playingIcon = document.getElementById("icon_audio_playing" + audioid)
            audioLoading = document.getElementById("audioloading" + audioid);
            $("#audioPlay1").attr("src", $("#music"+audioid).attr("audio"));

            audio.play();
            // toggle icons display
            playIcon.style.display = "none";
            audioLoading.style.display = "inline-block"
            playingIcon.style.display = "none";
            audioPlayingId = audioid
        } else { // pause audio
            if (audioPlayingId == audioid) {
                audio.pause()
            } else {
                audio.pause()
                playIcon.style.display = "inline-block";
                audioLoading.style.display = "none";
                playingIcon.style.display = "none";

            //初始化新的播放数据
            playLength = document.getElementById("audio_length" + audioid)
            playhead = document.getElementById('playhead' + audioid)
            var currenttimeline = document.getElementById('timeline' + audioid);
            timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
            playIcon = document.getElementById("icon_audio_default" + audioid)
            playingIcon = document.getElementById("icon_audio_playing" + audioid)
            audioLoading = document.getElementById("audioloading" + audioid);
            $("#audioPlay1").attr("src", $("#music"+audioid).attr("audio"));
            audio.play();
            // toggle icons display
            playIcon.style.display = "none";
            audioLoading.style.display = "inline-block"
            playingIcon.style.display = "none";
            audioPlayingId = audioid
            }
        }
    }

    // timeupdate event listener
    audio.addEventListener("timeupdate", timeUpdate, false);

    // timeUpdate
    // Synchronizes playhead position with current point in audio
    function timeUpdate() {
        if (audioPlayingId === undefined) {
            return
        }
        var playPercent = timelineWidth * (audio.currentTime / duration);
        playhead.style.width = playPercent + "px";
        if (audio.currentTime == duration) {
            playIcon.style.display = "inline-block";
            playingIcon.style.display = "none";
        }
    }

    audio.onplaying = function () {
        console.log('onplaying')
        playIcon.style.display = "none";
        audioLoading.style.display = "none";
        playingIcon.style.display = "inline-block";
    }

    audio.onpause = function () {
        console.log("onpause")
        playIcon.style.display = "inline-block";
        audioLoading.style.display = "none";
        playingIcon.style.display = "none";
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

    function audioAutoPlay(docid) {
        play(docid);
        document.addEventListener("WeixinJSBridgeReady", function () {
            audio.play(docid);
        }, false);
    }

    if (isAutoPlay) {
        var docid = newAudioInfo[0].doc_id
        audioAutoPlay(docid);
    }

};

var minid = 0

function songdom(results) {
    if (results.length == 0) {
        return ""
    }
    var dom = ""
    var model = ""
    minid = results[0].doc_id
    for (var index = 0; index < results.length; index++) {
        var element = results[index];
        model = songmodel
        model = model.replace(/{{index}}/g, element.doc_id)
        model = model.replace(/{{title}}/g, element["title"])
        var arr = element['url'].split('/');
        var source = ""
        if (arr.length > 2) {
            source = arr[2];
        } else {
            source = ""
        }
        model = model.replace(/{{audiosource}}/g, source)
        model = model.replace(/{{newstime}}/g, getDateDiff(element['news_time']))
            .replace(/{{doc_id}}/g, element.doc_id)
            .replace(/{{audio}}/g, element.audio)
        dom += model
        minid = minid > element.doc_id ? element.doc_id : minid
        //获取最小的 id 作为下次获取数据的起始点
    }
    return dom
}

var fetchdataing = false
window.onscroll = function () {
    //console.log(`getScrollHeight=${getScrollHeight()}, getWindowHeight=${getWindowHeight()}, getDocumentHeight=${getDocumentTop()}`)
    if (fetchdataing == false && getScrollHeight() <= getWindowHeight() + getDocumentTop()) {
        //当滚动条到底时,这里是触发内容
        //异步请求数据,局部刷新dom
        fetchNewsData()
    }
}

function fetchNewsData() {
    data = {}
    data.maxid = minid
    fetchdataing = true
    $.ajax({
        type: "GET",
        url: "/api/news",
        data: data,
        contentType: "json",
        beforeSend: function (XMLHttpRequest) {

        },
        success: function (data, status, xhr) {
            newResults = JSON.parse(data)
            var dom = songdom(newResults)
            $("#audiolist").append(dom)
            initPlayer(newResults,  false)
        },
        error: function (xhr, errorType, error) {

        },
        complete: function (xhr, status) {
            fetchdataing = false
        }
    })
}

//文档顶部滚动的距离
function getDocumentTop() {
    var scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;
    if (document.body) {
        bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}

//可视窗口高度
function getWindowHeight() {
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
    } else {
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

//滚动条滚动高度
function getScrollHeight() {
    var scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0;
    if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}

//JavaScript函数：
var minute = 1000 * 60;
var hour = minute * 60;
var day = hour * 24;
var halfamonth = day * 15;
var month = day * 30;
var year = month * 12;

function getDateDiff(dateTimeStamp) {
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp * 1000;
    if (diffValue < 0) {
        //若日期不符则弹出窗口告之
        //alert("结束日期不能小于开始日期！");
    }
    var yearC = diffValue / year
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (yearC >= 1) {
        result = parseInt(yearC) + "年前"
    } else if (monthC >= 1) {
        result = parseInt(monthC) + "个月前";
    } else if (weekC >= 1) {
        result = parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        result = parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        result = parseInt(hourC) + "个小时前";
    } else if (minC >= 1) {
        result = parseInt(minC) + "分钟前";
    } else
        result = "刚刚";
    return result;
}