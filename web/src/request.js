import axios from 'axios'
const baseURL = window.globalData.baseURL
const request = axios.create({
    baseURL,
    timeout: 60000,
    headers: {
        // 'Content-Type': 'application/json;charset=utf-8',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
console.log(window.globalData.baseURL)
request.interceptors.request.use(function (config) {
    console.log('发送请求之前做的事')
    return config
}, function (error) {
    console.log('对请求错误做些什么')
    return Promise.reject(error)
})

export function requestFunc (key = '', requestBody = {}, method = 'get') {
    return request({
        method,
        url: baseURL + key,
        data: requestBody
    })
}

export function uploadFunc (form) {
    request.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    return request({
        method: 'post',
        url: baseURL + '/uploadFile',
        data: form
    })
}

export function turingRobotRequestFunc (requestBody = {}) {
    return request({
        method: 'post',
        url: 'http://openapi.tuling123.com/openapi/api/v2',
        data: requestBody
    })
}
