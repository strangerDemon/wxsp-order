import services from '../services/index'
// wx.request 封装

export const wxRequest = function wxRequest(method, data, resolve, reject,isMustReturn) {
  let config = {};
  config = {
    para: JSON.stringify(data)
  }
  wx.request({
    url: services.requestApiUrl + method,
    data: config,
    method: 'GET',
    header: {
      'content-type': 'json', //坑爹，千万不要'application/json'
      //'Cookie': app.globalData.cookie  // 全局变量中获取 cookie
    },
    success: function(resp) { //无论失败成功都是走success
      if (resp && resp.statusCode == 200 && resp.data) {
        //不在统计处理请求失败，交给store内自己处理
        //resolve(resp.data);
        if (resp.data.RespCode == 1) { //请求返回码
          resolve(resp.data.Results)
        } else {
          wx.navigateTo({
            url: '/pages/msg/msg_fail/main?title=操作失败&details='+resp.data.RespDesc
          });
        }
      } else {
        wx.navigateTo({
          url: '/pages/msg/msg_fail/main?title=操作失败&details=请求失败:'+resp.data.RespDesc
        });
      }
      if (isMustReturn) { //当执行到这里时，说明请求失败，再此处理特殊操作
        resolve(resp.data.Results);
      }
    },
    fail: (err) => reject(err)
  })
}