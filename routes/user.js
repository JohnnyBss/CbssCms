let express = require('express');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  let service = new commonService.commonInvoke('user');
  let pageNumber = req.query.pageNumber;
  if(pageNumber === undefined){
    pageNumber = 1;
  }

  service.getPageData(pageNumber, function (result) {
    let renderData = commonService.buildRenderData('用户信息管理', pageNumber, result);
    res.render('user', renderData);
  });
});

router.get('/cellphone', function(req, res, next) {
  let service = new commonService.commonInvoke('userCellphone');
  let cellphone = req.query.cellphone;

  service.get(cellphone, function (result) {
    if(result.err){
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
  let service = new commonService.commonInvoke('user');
  let data = {
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    userName: req.body.userName,
    userRole: req.body.userRole,
    cellphone: req.body.cellphone,
    password: '111111',
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: false,
        msg: result.msg
      });
    }
  })
});

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('user');
  let data = {
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    userID: req.body.userID,
    userName: req.body.userName,
    userRole: req.body.userRole,
    cellphone: req.body.cellphone,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: false,
        msg: result.msg
      });
    }
  })
});

router.put('/changePassword', function (req, res, next) {
  let service = new commonService.commonInvoke('changePassword');
  let data = {
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    userID: req.body.userID,
    password: req.body.password,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: false,
        msg: result.msg
      });
    }
  })
});

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('user');
  let userID = req.query.userID;

  service.delete(userID, function (result) {
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

module.exports = router;