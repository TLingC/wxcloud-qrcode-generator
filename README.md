# wxcloud-qrcode-generator
小程序云开发 - 二维码生成工具

## 实现
根据前端传递到需要生成的内容，生成二维码后上传至云存储，返回对应文件的URL。

二维码生成使用了`qrcode`库，可参考：https://www.npmjs.com/package/qrcode

## 使用

```javascript
wx.showLoading()
wx.cloud.callFunction({
  name: 'qrcode_generator',
  data: {
    text: '需要生成的文字内容'
  },
  complete: res => {
    wx.hideLoading()
    wx.previewImage({
      urls: [res.result],
    })
  },
  fail: err => {
    wx.showModal({
      content: '二维码生成失败，请重试'
    })
  }
})
```
