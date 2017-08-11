// $.getJSON('/awesome.json', function (data) {
//   console.log(data)
// })

function getURLParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return decodeURI(r[2]);
  return null; //返回参数值
}

function sceneDidload() {

  url = getURLParam('url');
  title = getURLParam("title");
  if (url != null && title != null) {
    var audioItem = `<div class="audioItem" audio="${url}">${title}</div>`
    $("#playlist").append(audioItem);
    $("#audioPlay").attr("src", url)
  }
}