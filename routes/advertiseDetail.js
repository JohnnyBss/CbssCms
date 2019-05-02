let express = require('express');
let path = require('path');
let fs = require("fs");
let multer = require('multer');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();

let createFolder = function(folder){
  try{
    fs.accessSync(folder);
  }catch(e){
    fs.mkdirSync(folder);
  }
};

let uploadPath = path.join(path.resolve(__dirname, '..'), 'public', 'advertise', 'upload');

createFolder(uploadPath);

let storage = multer.diskStorage({
  destination: function (req, file, cb){
    //文件上传成功后会放入public下的upload文件夹
    cb(null, uploadPath)
  },
  filename: function (req, file, cb){
    //设置文件的名字为其原本的名字，也可以添加其他字符，来区别相同文件，例如file.originalname+new Date().getTime();利用时间来区分
    cb(null, file.originalname)
  }
});

let upload = multer({storage: storage});

router.post('/fileUpload',  upload.array('file', 10), function(req,res,next){
  let uploadFileUrlArray = [];
  req.files.forEach(function (file, index) {
    uploadFileUrlArray.push('http://' + req.headers.host + '/advertise/upload/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    imageUrl : uploadFileUrlArray
  });
  res.end();
});

router.delete('/deleteFile', function (req, res, next) {
  let fileName = req.query.fileName;
  let filePath = './public/advertise/upload/' + fileName;

  fs.exists(filePath, function (exists) {
    if(exists){
      fs.unlink(filePath, function(err) {
        if (err) {
          res.json({err: true, msg: '文件删除失败。'});
        }else{
          res.json({err: false, msg: '文件删除成功。'});
        }
      });
    }else{
      res.json({err: false, msg: '文件删除功能。'});
    }
  });
});

router.get('/', function(req, res, next) {
  res.render('advertiseDetail', {
    title: '大屏广告内容详细信息',
    option: req.query.option,
    moduleID: req.query.moduleID,
  });
});

router.get('/data', function (req, res, next) {
  let service = new commonService.commonInvoke('advertise');
  service.get(req.query.moduleID, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        data: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('advertise');
  let data = {
    moduleName: req.body.moduleName,
    detailJson: req.body.detailJson,
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('advertise');
  let data = {
    moduleID: req.body.moduleID,
    moduleName: req.body.moduleName,
    detailJson: req.body.detailJson,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('advertise');
  service.delete(req.query.moduleID, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

module.exports = router;