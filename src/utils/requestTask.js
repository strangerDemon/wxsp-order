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
        if (resp.data.RespCode == 1) { //请求返回码
          resolve(resp)
        } else {
          wx.showModal({
            content: resp.data.RespDesc,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('服务器未返回结果')
              }
            }
          });
        }
      } else {
        wx.showModal({
          content: resp.data.Message,
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              console.log('请求失败')
            }
          }
        });
      }
      if (method == "getUserInfo") { //当执行到这里时，说明请求失败，再此处理特殊操作
        resolve(resp);
      }
    },
    fail: (err) => reject(err)
  })
}