let express = require('express');
let multer = require('multer');
let sysConfig = require('../config/sysConfig');
let fs = require("fs");
let router = express.Router();
let commonService = require('../service/commonService');

let storage = multer.diskStorage({
  destination: function (req, file, cb){
    //文件上传成功后会放入public下的upload文件夹
    cb(null, './public/images/upload')
  },
  filename: function (req, file, cb){
    //设置文件的名字为其原本的名字，也可以添加其他字符，来区别相同文件，例如file.originalname+new Date().getTime();利用时间来区分
    cb(null, file.originalname)
  }
});

let upload = multer({
  storage: storage
});

router.get('/', function(req, res, next) {
  let itemID = req.query.itemID;
  let breadcrumbs = req.query.breadcrumbs;
  res.render('detail', { title: '考评点明细管理', itemID: itemID, breadcrumbs: breadcrumbs});
});

router.get('/data', function (req, res, next) {
  let service = new commonService.commonInvoke('detail4Item');
  let parameter = '/' + sysConfig.bankID + '/' + sysConfig.branchID + '/' + req.query.itemID + '/' + req.query.year + '/' + req.query.quarter;

  service.get(parameter, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        dataList: result.content.responseData
      });
    }
  });
});

router.get('/imageMemo', function (req, res, next) {
  let service = new commonService.commonInvoke('detail4ImageMemo');
  let parameter = '/' + sysConfig.bankID + '/' + sysConfig.branchID + '/' + req.query.itemID + '/' + req.query.textMapDetail;

  service.get(parameter, function (result) {
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

router.delete('/deleteDetailImage', function (req, res, next) {
  let service = new commonService.commonInvoke('deleteDetailImage');
  let parameter = '/' + sysConfig.bankID + '/' + sysConfig.branchID + '/' + req.query.itemID + '/' + req.query.detailID;

  service.delete(parameter, function (result) {
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

router.delete('/deleteOfItem', function (req, res, next) {
  let service = new commonService.commonInvoke('deleteDetailOfItem');
  let parameter = sysConfig.bankID + '/' + sysConfig.branchID + '/' + req.query.itemID + '/' + req.query.year + '/' + req.query.quarter;

  service.delete(parameter, function (result) {
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
  let service = new commonService.commonInvoke('detail');
  let data = {
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    itemID: req.body.itemID,
    sequence: 0,
    animation: '',
    contentType: req.body.contentType,
    content: req.body.content,
    textMapDetail: req.body.textMapDetail,
    year: req.body.year,
    quarter: req.body.quarter,
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

router.post('/fileUpload',  upload.array('file', 10), function(req,res,next){
  let uploadImageUrlArray = [];
  req.files.forEach(function (file, index) {
    uploadImageUrlArray.push('http://' + req.headers.host + '/images/upload/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    imageUrl : uploadImageUrlArray
  });
  res.end();
});

module.exports = router;