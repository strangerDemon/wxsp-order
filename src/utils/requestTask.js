import tokenUtil from './tokenUtil'
// wx.request 封装

export const wxRequest = function wxRequest(method, data, resolve, reject) {
  let config = {};
  data["Token"] = tokenUtil.token
  config = {
    para: JSON.stringify(data)
  }
  wx.request({
    url: 'https://www.ztgis.com/lpb.asmx/' + method,
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
            url: '../../msg/msg_fail/main?title=操作失败&details=服务器返回结果:'+resp.data.RespDesc
          });
          /*wx.showModal({
            content: resp.data.RespDesc,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('服务器返回结果:'+resp.data.RespDesc)
              }
            }
          });*/
        }
      } else {
        wx.navigateTo({
          url: '../../msg/msg_fail/main?title=操作失败&details=请求失败:'+resp.data.RespDesc
        });
        /*wx.showModal({
          content: '服务器返回结果:'+resp.data.Message,
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              console.log('请求失败')
            }
          }
        });*/
      }
      if (method == "getUserInfo") { //当执行到这里时，说明请求失败，再此处理特殊操作
        resolve(resp.data.Results);
      }
    },
    fail: (err) => reject(err)
  })
}