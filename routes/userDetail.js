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

let uploadPath = path.join(path.resolve(__dirname, '..'), 'public', 'images', 'user');

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
    uploadFileUrlArray.push('http://' + req.headers.host + '/images/user/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    imageUrl : uploadFileUrlArray
  });
  res.end();
});

router.get('/', function(req, res, next) {
  res.render('userDetail', {
    title: '员工账户编辑',
    option: req.query.option,
    userID: req.query.userID
  });
});

module.exports = router;