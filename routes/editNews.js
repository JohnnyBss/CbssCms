let express = require('express');
let path = require('path');
let fs = require("fs");
let multer = require('multer');
let uploadUtils = require('../common/uploadUtils');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();


let upload = uploadUtils.createUploadObject(['public','images','news']);

router.get('/', function(req, res, next) {
  let newsID = req.query.newsID;
  let saveType = req.query.saveType;
  res.render('editNews', {title: '新闻编辑', newsID: newsID, saveType: saveType});
});

router.get('/updNews', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
  let parameter = req.query.newsID;

  service.get(parameter, function (result) {
    if (result.err || !result.content.result) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        data: result.content.responseData
      });
    }
  })
});

router.delete('/deleteFile', function (req, res, next) {
  let fileName = req.query.fileName;
  let filePath = './public/images/upload/' + fileName;

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

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('news');
  let data = {
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    newsTitle: req.body.newsTitle,
    newsDate: req.body.newsDate,
    thumbnailUrl: req.body.thumbnailUrl,
    status: 'A',
    newsContentJson: req.body.newsContentJson,
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
  let service = new commonService.commonInvoke('news');
  let data = {
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    newsID: req.body.newsID,
    newsTitle: req.body.newsTitle,
    newsDate: req.body.newsDate,
    thumbnailUrl: req.body.thumbnailUrl,
    status: 'A',
    newsContentJson: req.body.newsContentJson,
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

router.post('/fileUpload',  upload.array('file', 10), function(req,res,next){
  let uploadImageUrlArray = [];
  req.files.forEach(function (file, index) {
    uploadImageUrlArray.push('http://' + req.headers.host + '/images/news/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    imageUrl : uploadImageUrlArray
  });
  res.end();
});

module.exports = router;