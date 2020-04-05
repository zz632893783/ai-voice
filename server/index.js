// const http = require('http');
// const server = http.createServer(function (request, response) {
// 	// console.log(request.method + ':' + request.url);
// 	// response.writeHead(200, {
// 	// 	'Content-Type': 'application/json',
// 	// });
// 	// response.header('Access-Control-Allow-Origin', '*')
// 	// response.header('Access-Control-Allow-Headers', 'content-type');
//  //    response.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
// 	let res = {
// 		msg: 'success'
// 	};
// 	response.end(JSON.stringify(res));
// });
// server.listen(8000);
const express = require('express');
const app = express();
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
	next();
});
let resData = {
	msg: 'success'
};
app.get('/getData', function(req, res) {
    res.send(resData)
});
// 音频处理
const multiparty = require('multiparty')
const fs = require('fs')
app.post('/uploadFile', function(req, res) {
    let form = new multiparty.Form();
	form.parse(req, function (err, fields, files) {
		let file = files.file[0]
		fs.readFile(file.path, function (err, data) {
			if (err) {
				return console.log('读取失败')
			}
			let fileName = `${(new Date()).getTime()}-${Math.random().toFixed(10).split(/\./)[1]}.wav`
			fs.writeFile(`./uploadVoice/${fileName}`, data, function (err) {
				if (err) {
					return console.log('上传失败')
				}
				transformFile(fileName)
				// ffmpeg(`./uploadVoice/${fileName}`)
				// 	.audioBitrate(126)
				// 	.audioChannels(1)
				// 	.audioFrequency(16000)
				// 	.audioCodec('pcm_s16le')
				// 	.format('wav')
				// 	.on('end', function() {
				// 		console.log('file has been converted succesfully');
				// 	})
				// 	.on('error', function(err) {
				// 		console.log('an error happened: ' + err.message);
				// 	})
				// 	.save(`./transformVoice/${fileName}`);
			})
		})
	})
});
const ffmpeg = require('fluent-ffmpeg');
function transformFile (fileName) {
	ffmpeg(`./uploadVoice/${fileName}`)
		.audioBitrate(126)
		.audioChannels(1)
		.audioFrequency(16000)
		.audioCodec('pcm_s16le')
		.format('wav')
		.on('end', function() {
			console.log('file has been converted succesfully');
		})
		.on('error', function(err) {
			console.log('an error happened: ' + err.message);
		})
		.save(`./transformVoice/${fileName}`);
}
app.listen(3000);