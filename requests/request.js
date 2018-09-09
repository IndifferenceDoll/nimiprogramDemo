import api from './api'

const wxRequest = (url = '',method = 'GET',header = {},params = {}) =>{
    url = api.baseUrl + url;
    let headers = Object.assign({ "Content-Type":"json" },header);
    return new Promise((resolve,reject) => {
        wx.request({
            url: url,
            method: method,
            header:headers,
            data: params,
            success: function (res) {
                resolve(res)
            },
            fail:function(fail){
                reject(fail)
            }
        })
    })
}
module.exports = {
    wxRequest:wxRequest
}