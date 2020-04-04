var AipSpeechClient = require("baidu-aip-sdk").speech;

// 设置APPID/AK/SK
var APP_ID = "19253744";
var API_KEY = "WbknWFdrFHKnzv7SPe6DKBwh";
var SECRET_KEY = "BcPs7U4WSie5zVk1UBT66yLwmnOuOGSg";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

let fs = require('fs');
let voice = fs.readFileSync('assets/testVoice12.wav');
let voiceBuffer = new Buffer(voice);
client.recognize(voiceBuffer, 'wav', 16000).then(function (result) {
    console.log('<recognize>: ' + JSON.stringify(result));
}, function(err) {
    console.log(err);
});

// var ffmpeg = require('fluent-ffmpeg'); 
// var command = new ffmpeg('assets/downloadFiles7.mp3')
// 	.audioBitrate('128k')
// 	.format('wav')
// 	.on('end', function() { 
// 		console.log('file has been converted succesfully'); 
// 	}) 
// 	.on('error', function(err) { 
// 		console.log('an error happened: ' + err.message); 
// 	})
// 	.save('outtest.mp3')