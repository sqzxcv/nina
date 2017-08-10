$.getJSON('/awesome.json', function (data) {
  console.log(data)
})

function getURLParam(name) {
  var reg = new RegExp("(^|&)" + url + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}

function sceneDidLoad() {

  url = getURLParam('url');
  title = getURLParam("title")
  if (url != null && title != null) {
    var audioItem = `<div class="audioItem" id="audioItem" audio="${url}">${title}</div>`
    $("#playlist").append(item);
    $("#audioPlay").attr("src", url)
  }
}