<template>
    <div class="home">
        <!-- <input type="file" v-on:change="playMusicFunc" class="select-file"> -->
        <audio ref="audio" class="audio-node" autoplay></audio>
        <button v-on:click="beginRecord">开始录音</button>
        <button v-on:click="stopRecord">停止录音</button>
    </div>
</template>

<script>
// @ is an alias to /src
// class AudioRecorder {
// }
export default {
    name: '录音功能',
    // 参考文章
    url: 'https://zhuanlan.zhihu.com/p/43581133?ADUIN=3336098807',
    data: function () {
        return {
            leftDataList: [],
            rightDataList: [],
            mediaStream: null,
            mediaNode: null,
            jsNode: null
        }
    },
    components: {},
    mounted: function () {},
    methods: {
        playRecord: function (arrayBuffer) {
            /* eslint-disable */
            let blob = new Blob([new Uint8Array(arrayBuffer)])
            let blobUrl = URL.createObjectURL(blob)
            this.$refs.audio.src = blobUrl
            console.log('blobUrl', blobUrl)
        },
        beginRecord: function () {
            let that = this
            window.navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 44100,
                    channelCount: 2,
                    volume: 1.0
                }
            }).then(mediaStream => {
                that.mediaStream = mediaStream
                let audioContext = new (window.AudioContext || window.webkitAudioContext)
                let mediaNode = audioContext.createMediaStreamSource(mediaStream)
                that.mediaNode = mediaNode
                let jsNode = that.createJSNode(audioContext)
                that.jsNode = jsNode
                jsNode.connect(audioContext.destination)
                jsNode.onaudioprocess = function (event) {
                    let audioBuffer = event.inputBuffer
                    let leftChannelData = audioBuffer.getChannelData(0)
                    let rightChannelData = audioBuffer.getChannelData(1)
                    that.leftDataList.push(leftChannelData.slice(0))
                    that.rightDataList.push(rightChannelData.slice(0))
                }
                mediaNode.connect(jsNode)
            }).catch(err => {
                // 如果用户电脑没有麦克风设备或者用户拒绝了，或者连接出问题了等
                // 这里都会抛异常，并且通过err.name可以知道是哪种类型的错误 
                alert('请允许浏览器使用麦克风')
            })
        },
        createJSNode: function (audioContext) {
            const BUFFER_SIZE = 4096
            const INPUT_CHANNEL_COUNT = 2
            const OUTPUT_CHANNEL_COUNT = 2
            let creator = audioContext.createScriptProcessor || audioContext.createJavaScriptNode
            creator = creator.bind(audioContext)
            return creator(BUFFER_SIZE, INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT)
        },
        stopRecord: function () {
            this.mediaStream.getAudioTracks()[0].stop();
            this.mediaNode.disconnect();
            this.jsNode.disconnect();
            let leftData = this.mergeArray(this.leftDataList)
            let rightData = this.mergeArray(this.rightDataList)
            let allData = this.interleaveLeftAndRight(leftData, rightData);
            let wavBuffer = this.createWavFile(allData);
            this.playRecord(wavBuffer)
        },
        mergeArray: function (list) {
            let length = list.length * list[0].length
            let data = new Float32Array(length)
            let offset = 0
            for (let i = 0; i < list.length; i++) {
                data.set(list[i], offset);
                offset = offset + list[i].length;
            }
            return data
        },
        interleaveLeftAndRight: function (left, right) {
            let totalLength = left.length + right.length
            let data = new Float32Array(totalLength)
            for (let i = 0; i < left.length; i++) {
                let k = i * 2
                data[k] = left[i]
                data[k + 1] = right[i]
            }
            return data
        },
        createWavFile: function (audioData) {
            const WAV_HEAD_SIZE = 44
            let buffer = new ArrayBuffer(audioData.length * 2 + WAV_HEAD_SIZE)
            // 需要用一个view来操控buffer
            let view = new DataView(buffer)
            // 写入wav头部信息
            // RIFF chunk descriptor/identifier
            this.writeUTFBytes(view, 0, 'RIFF')
            // RIFF chunk length
            view.setUint32(4, 44 + audioData.length * 2, true)
            // RIFF type
            this.writeUTFBytes(view, 8, 'WAVE')
            // format chunk identifier
            // FMT sub-chunk
            this.writeUTFBytes(view, 12, 'fmt ')
            // format chunk length
            view.setUint32(16, 16, true)
            // sample format (raw)
            view.setUint16(20, 1, true)
            // stereo (2 channels)
            view.setUint16(22, 2, true)
            // sample rate
            view.setUint32(24, 44100, true)
            // byte rate (sample rate * block align)
            view.setUint32(28, 44100 * 2, true)
            // block align (channel count * bytes per sample)
            view.setUint16(32, 2 * 2, true)
            // bits per sample
            view.setUint16(34, 16, true)
            // data sub-chunk
            // data chunk identifier
            this.writeUTFBytes(view, 36, 'data')
            // data chunk length
            view.setUint32(40, audioData.length * 2, true)
            let length = audioData.length
            let index = 44
            let volume = 1
            for (let i = 0; i < length; i++) {
                view.setInt16(index, audioData[i] * (0x7FFF * volume), true);
                index = index + 2
            }
            return buffer
        },
        writeUTFBytes: function (view, offset, string) {
            var lng = string.length
            for (var i = 0; i < lng; i++) { 
                view.setUint8(offset + i, string.charCodeAt(i))
            }
        }
    }
}
</script>
