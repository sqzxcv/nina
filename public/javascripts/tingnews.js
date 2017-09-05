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
    contentHtml = info['contentHtml'].replace(/style="([^"]+)"/g, "")
    $('#content').append(contentHtml)
}

window.onscroll = function () {
    if (getScrollHeight() == getWindowHeight() + getDocumentTop()) {
        //当滚动条到底时,这里是触发内容
        //异步请求数据,局部刷新dom
        $.ajax({
            type: "GET",
            url: "/",
            data: data,
            contentType: "json",
            beforeSend: function (XMLHttpRequest) {

            },
            success: function (data, status, xhr) {

            },
            error: function (xhr, errorType, error) {

            }
        })
    }
}

//文档高度
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