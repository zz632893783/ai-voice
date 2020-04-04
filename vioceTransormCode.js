// const ffmpeg = require('ffmpeg')
// try {
// 	// console.log(1)
// 	let process = new ffmpeg('./voice.wav')
// 	// console.log(2)
// 	process.then(function (audio) {
// 		audio.setAudioChannels(2)
// 		.save('your_movie.mp3', function (error, file) {
// 			if (!error) {
// 				console.log('Video file: ' + file)
// 			}
// 			console.log('file')
// 		})
// 		console.log('success')
// 	}, function () {
// 		console.log('error')
// 	})
// 	// let command = 
// 	// .save('D:/desktop/testfile/454224124c08470a90a9eaa0b3cb885a/123224124c08470a90a9eaa0b3cb6666/ts/1080p_3_2-%03d.ts')
// 	// ffmpeg('./voice.wav').videoBitrate(16000)
// 	// 	.on('end', function() {
// 	// 		console.log('file has been converted succesfully');    
// 	// 	})
// 	// 	.on('error', function(err) {
// 	// 		console.log('an error happened: ' + err.message);
// 	// 	})
// } catch (e) {
// 	console.log('catch', e)
// }
// let ffmpeg = require('../../../softwave/ffmpeg-git-20200324-amd64-static/ffmpeg')
// console.log('ffmpeg', ffmpeg)

var ffmpeg = require('fluent-ffmpeg');

ffmpeg('./voice.wav')
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
	.save('./testVoice12.wav');