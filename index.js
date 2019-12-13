const fs = require('fs')
const path = require('path')
const cloud = require('wx-server-sdk')
const qrcode = require('qrcode')
const md5 = require('md5')

cloud.init()

exports.main = async(event, context) => {
  return new Promise((resolve, reject) => {
    if (event.text == undefined) {
      console.log('没有提供 text 参数。')
      return false;
    }

    qrcode.toFile('/tmp/temp.png', event.text, {
      margin: 1,
      width: 430
    }, async(err) => {
      if (err) throw err

      const fileStream = fs.createReadStream('/tmp/temp.png')
      const file = await cloud.uploadFile({
        cloudPath: 'qrcode/' + md5(event.text) + '.png',
        fileContent: fileStream
      })
      if (file.errCode != undefined) {
        console.log('请求上传图片API失败，错误信息：' + file.errMsg)
        return false
      }

      const urls = await cloud.getTempFileURL({
        fileList: [file.fileID],
      })
      if (urls.errCode != undefined) {
        console.log('请求获取图片地址API失败，错误信息：' + urls.errMsg)
        return false
      }
      if (urls.fileList[0].tempFileURL == '') {
        console.log('获取图片地址失败，错误信息：' + urls.fileList[0].errMsg)
        return false
      }
      resolve(urls.fileList[0].tempFileURL)
    })
  })
}