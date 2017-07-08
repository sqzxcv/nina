var request = require("request");
var co = require("co");

function requestPromise(options) {
  return new Promise(function (resolve, reject) {
    request(options, function(err, response, body) {
      if (err) reject(err);
      resolve(body);
    });
  });
}
co(function* () {
  var body = yield requestPromise('http://www.baidu.com');
  console.log(body);
})