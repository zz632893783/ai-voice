var AipSpeechClient = require("baidu-aip-sdk").speech;

// 设置APPID/AK/SK
var APP_ID = "19253744";
var API_KEY = "WbknWFdrFHKnzv7SPe6DKBwh";
var SECRET_KEY = "BcPs7U4WSie5zVk1UBT66yLwmnOuOGSg";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

const fs = require('fs');

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
				transformFile(fileName, req, res)
			})
		})
	})
});
const ffmpeg = require('fluent-ffmpeg');
function transformFile (fileName, req, res) {
	ffmpeg(`./uploadVoice/${fileName}`)
		.audioBitrate(126)
		.audioChannels(1)
		.audioFrequency(16000)
		.audioCodec('pcm_s16le')
		.format('wav')
		.on('end', function() {
			readVoice(fileName, req, res)
		})
		.on('error', function(err) {
			console.log('an error happened: ' + err.message);
		})
		.save(`./transformVoice/${fileName}`);
}
app.listen(4321);

const request = require('request')
function readVoice (fileName, req, res) {
	let voice = fs.readFileSync(`./transformVoice/${fileName}`);
	let voiceBuffer = new Buffer(voice);
	client.recognize(voiceBuffer, 'wav', 16000).then(function (result) {
		let question = result.result[0]
		const url = `http://api.qingyunke.com/api.php?key=free&appid=0&msg=${encodeURI(question)}`
		request.get(url, {}, function (err, httpResponse, body) {
			let result = JSON.parse(body)
			let answer = result.content
			console.log('result', question, answer)
			res.send({
				question,
				answer
			})
		})
	}, function(err) {
	    console.log(err);
	});
}
	