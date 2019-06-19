let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('item', {title: '考评内容管理'});
});

router.get('/data', function(req, res, next) {
  let service = new commonService.commonInvoke('item');
  let parameter = '/' + sysConfig.bankID + '/' + sysConfig.branchID;
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
        itemList: result.content.responseData
      });
    }
  });
});

router.get('/checkName', function (req, res, next) {
  let service = new commonService.commonInvoke('itemExist');
  let parameter = req.query.itemName;

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
        exist: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('item');
  let data = {
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    itemName: req.body.itemName,
    itemType: req.body.itemType,
    parentItemID: req.body.parentItemID,
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

router.post('/detail', function (req, res, next) {
  let service = new commonService.commonInvoke('saveDetailItem');
  let data = {
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    itemName: req.body.itemName,
    itemType: req.body.itemType,
    parentItemID: req.body.parentItemID,
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
  let service = new commonService.commonInvoke('item');
  let data = {
    itemID: req.body.itemID,
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    itemName: req.body.itemName,
    itemType: req.body.itemType,
    parentItemID: req.body.parentItemID,
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

router.put('/move', function (req, res, next) {
  let service = new commonService.commonInvoke('moveItem');
  let data = {
    itemID: req.body.itemID,
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    itemName: req.body.itemName,
    itemType: req.body.itemType,
    parentItemID: req.body.parentItemID,
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

router.put('/changeNodeOrder', function (req, res, next) {
  let service = new commonService.commonInvoke('changeNodeOrder');
  let data = {
    bankID: sysConfig.bankID,
    branchID: sysConfig.branchID,
    parentItemID: req.body.parentItemID,
    itemsOrder: req.body.childNodeOrder,
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
  let service = new commonService.commonInvoke('item');
  let itemID = req.query.itemID;
  let itemType = req.query.itemType;
  let parameter = '/' + sysConfig.bankID + '/' + sysConfig.branchID + '/' + itemID + '/' + itemType;

  service.delete(parameter, function (result) {
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