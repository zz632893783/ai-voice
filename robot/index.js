const request = require('request')
// 文档
let msg = '杭州的天气怎么样'
const url = `http://api.qingyunke.com/api.php?key=free&appid=0&msg=${encodeURI(msg)}`
request.get(url, {}, function (err, httpResponse, body) {
	let result = JSON.parse(body)
	console.log(result.content)
})